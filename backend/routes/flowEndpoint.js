/**
 * WhatsApp Flow data endpoint for the qualification flow.
 * Multi-screen with dynamic branching: on the SIZE screen, 500+ closes the flow
 * immediately (skip Q2-Q4); otherwise it walks SITUATION -> TIMELINE -> ROLE.
 * Stateless — each step forwards the accumulated answers to the next screen.
 */
import express from 'express';
import { decryptRequest, encryptResponse } from '../services/flowCrypto.js';
import logger from '../services/logger.js';

const router = express.Router();

function sendEncrypted(res, obj, aesKeyBuffer, initialVectorBuffer) {
  const encrypted = encryptResponse(obj, aesKeyBuffer, initialVectorBuffer);
  res.type('text/plain').send(encrypted);
}

// Terminal response that closes the flow and returns params via nfm_reply
function complete(token, params) {
  return { screen: 'SUCCESS', data: { extension_message_response: { params: { flow_token: token, ...params } } } };
}

// Only the SIZE screen is server-driven (so 500+ can end the flow early).
// SITUATION -> TIMELINE -> ROLE navigate client-side; ROLE completes client-side.
function handleDataExchange(screen, data, token) {
  const d = data || {};
  if (screen === 'SIZE') {
    const company_size = d.company_size || '';
    if (company_size === '500_plus') {
      // Dynamically close the flow, skipping the remaining questions
      return complete(token, { company_size });
    }
    // Continue to the situation screen, carrying the size forward
    return { screen: 'SITUATION', data: { company_size } };
  }
  // Any other screen shouldn't hit the endpoint; be safe and restart at SIZE
  return { screen: 'SIZE', data: {} };
}

// Meta posts the raw encrypted envelope here. We must respond with a base64 string.
router.post('/', async (req, res) => {
  let aesKeyBuffer, initialVectorBuffer, decrypted;
  try {
    ({ decrypted, aesKeyBuffer, initialVectorBuffer } = decryptRequest(req.body));
  } catch (err) {
    logger.error('Flow endpoint decrypt failed', { error: err.message });
    return res.status(421).send(); // 421 → Meta refreshes the public key
  }

  try {
    const { action, screen, data = {}, flow_token } = decrypted;
    const token = flow_token || data.flow_token || '';

    if (action === 'ping') {
      return sendEncrypted(res, { data: { status: 'active' } }, aesKeyBuffer, initialVectorBuffer);
    }

    if (action === 'INIT') {
      return sendEncrypted(res, { screen: 'SIZE', data: {} }, aesKeyBuffer, initialVectorBuffer);
    }

    if (action === 'data_exchange') {
      const response = handleDataExchange(screen, data, token);
      return sendEncrypted(res, response, aesKeyBuffer, initialVectorBuffer);
    }

    return sendEncrypted(res, { data: {} }, aesKeyBuffer, initialVectorBuffer);
  } catch (err) {
    logger.error('Flow endpoint processing error', { error: err.message, stack: err.stack });
    return sendEncrypted(res, { screen: 'SIZE', data: { error_message: 'Something went wrong. Please try again.' } }, aesKeyBuffer, initialVectorBuffer);
  }
});

export default router;
