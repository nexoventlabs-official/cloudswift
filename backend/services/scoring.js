/**
 * Lead scoring engine.
 * Returns 'HOT' | 'WARM' | 'COLD' based on qualification answers.
 *
 * Rules (from WHATSAPP_AUTOMATION_v2.md):
 * HOT  — 500+ employees (any timeline, any intent)
 * HOT  — 100–500 employees + this/next quarter + switching/not_working/first_eval
 * HOT  — 100+ employees + first evaluation + this quarter
 * WARM — any size + switching/not_working + within 6 months
 * WARM — any size + first_eval + next_quarter/six_months
 * COLD — just researching + 6+ months / under 100
 */
export function scoreLead({ companySize, situation, timeline }) {
  // Enterprise override — always HOT regardless
  if (companySize === '500_2000' || companySize === '2000_plus') {
    return 'HOT';
  }

  // 100–500 employees with urgency
  if (companySize === '100_500') {
    if (
      (situation === 'not_working' || situation === 'switching' || situation === 'first_eval') &&
      (timeline === 'this_quarter' || timeline === 'next_quarter')
    ) {
      return 'HOT';
    }
    if (
      (situation === 'not_working' || situation === 'switching') &&
      timeline === 'six_months'
    ) {
      return 'WARM';
    }
    if (situation === 'first_eval' && (timeline === 'next_quarter' || timeline === 'six_months')) {
      return 'WARM';
    }
  }

  // Any size — switching/problem within 6 months → WARM
  if (
    (situation === 'not_working' || situation === 'switching') &&
    (timeline === 'this_quarter' || timeline === 'next_quarter' || timeline === 'six_months')
  ) {
    return 'WARM';
  }

  // Under 100 + just researching → COLD
  if (companySize === 'under_100' && situation === 'exploring') return 'COLD';
  if (timeline === 'researching') return 'COLD';

  // Default fallback
  return 'COLD';
}
