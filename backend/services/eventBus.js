// Simple in-process event bus for real-time lead alerts via Socket.IO.
// Import `io` from server.js after it's initialised to emit events.

let _io = null;

export function setIo(io) {
  _io = io;
}

export function emitLead(lead) {
  if (_io) {
    _io.to('admin').emit('new_lead', lead);
  }
}

export function emitLeadUpdate(lead) {
  if (_io) {
    _io.to('admin').emit('lead_update', lead);
  }
}

export function emitMessage(message) {
  if (_io) {
    _io.to('admin').emit('new_message', message);
  }
}
