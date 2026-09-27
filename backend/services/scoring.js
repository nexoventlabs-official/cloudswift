/**
 * Lead scoring engine (QR rules).
 * Returns 'HOT' | 'WARM' | 'COLD'.
 *
 * Hard overrides:
 *   - talkToPerson (A1)                     -> HOT
 *   - 500+ employees (any answers)          -> HOT   (Q1 short-circuits to this)
 *
 * Otherwise combine situation + timeline + role:
 *   HOT  — decision_maker + (switching|first_eval|not_working) + (this_quarter|next_quarter)
 *   HOT  — switching|not_working + this_quarter (any role)
 *   WARM — (switching|first_eval|not_working) + (this_quarter|next_quarter|six_months)
 *   WARM — decision_maker + six_months
 *   WARM — evaluating_team + (this_quarter|next_quarter)
 *   COLD — everything else (exploring / researching / far-off + low intent)
 */
export function scoreLead({ companySize, situation, timeline, role, talkToPerson } = {}) {
  // Hard overrides
  if (talkToPerson) return 'HOT';
  if (['500_plus', '500_2000', '2000_plus'].includes(companySize)) return 'HOT';

  const highIntent = situation === 'switching' || situation === 'not_working' || situation === 'first_eval';
  const near       = timeline === 'this_quarter' || timeline === 'next_quarter';
  const within6    = near || timeline === 'six_months';
  const isDM       = role === 'decision_maker';

  // HOT
  if (isDM && highIntent && near) return 'HOT';
  if ((situation === 'switching' || situation === 'not_working') && timeline === 'this_quarter') return 'HOT';

  // WARM
  if (highIntent && within6) return 'WARM';
  if (isDM && timeline === 'six_months') return 'WARM';
  if (role === 'evaluating_team' && near) return 'WARM';

  // COLD — just exploring/researching or far-off with weak intent
  return 'COLD';
}
