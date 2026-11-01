// Shared by the browser preview and the server-generated PDF. Indicative screening maths only;
// every lender uses its own method, so this is not a credit appraisal, CMA certification or approval.

export type LoanInput = {
  turnoverLatest: number; // INR, latest financial year
  turnoverPrevious: number; // INR, year before; 0 if not available
  netProfit: number; // INR, latest year (can be negative)
  depreciation: number; // INR
  interestPaid: number; // INR, on existing loans
  existingPrincipalRepayment: number; // INR due in the next 12 months on existing loans
  proposedAmount: number; // INR
  proposedRate: number; // % p.a.
  proposedTenureYears: number;
  collateralValue: number; // INR, 0 if none
};

export type LoanResult = {
  cashAccrual: number;
  existingObligation: number;
  existingDscr: number | null;
  proposedEmi: number;
  proposedAnnualService: number;
  combinedDscr: number | null;
  band: 'Strong' | 'Acceptable' | 'Weak' | 'Not serviceable on these numbers';
  profitMarginPct: number | null;
  turnoverGrowthPct: number | null;
  loanToTurnoverPct: number | null;
  interestCover: number | null;
  collateralCoverPct: number | null;
  flags: string[];
};

export function emi(principal: number, ratePercent: number, years: number): number {
  const n = Math.round(years * 12);
  if (!(principal > 0) || !(n > 0)) return 0;
  const r = ratePercent / 100 / 12;
  if (r === 0) return principal / n;
  const f = Math.pow(1 + r, n);
  return (principal * r * f) / (f - 1);
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function assessLoan(i: LoanInput): LoanResult {
  const cashAccrual = i.netProfit + i.depreciation + i.interestPaid;
  const existingObligation = i.interestPaid + i.existingPrincipalRepayment;
  const proposedEmi = emi(i.proposedAmount, i.proposedRate, i.proposedTenureYears);
  const proposedAnnualService = proposedEmi * 12;
  const existingDscr = existingObligation > 0 ? cashAccrual / existingObligation : null;
  const totalService = existingObligation + proposedAnnualService;
  const combinedDscr = totalService > 0 ? cashAccrual / totalService : null;
  const basis = combinedDscr;
  const band: LoanResult['band'] =
    basis === null ? 'Not serviceable on these numbers'
    : basis >= 1.5 ? 'Strong'
    : basis >= 1.25 ? 'Acceptable'
    : basis >= 1.0 ? 'Weak'
    : 'Not serviceable on these numbers';
  const profitMarginPct = i.turnoverLatest > 0 ? (i.netProfit / i.turnoverLatest) * 100 : null;
  const turnoverGrowthPct = i.turnoverPrevious > 0 ? ((i.turnoverLatest - i.turnoverPrevious) / i.turnoverPrevious) * 100 : null;
  const loanToTurnoverPct = i.turnoverLatest > 0 ? (i.proposedAmount / i.turnoverLatest) * 100 : null;
  const interestCover = i.interestPaid > 0 ? (i.netProfit + i.interestPaid) / i.interestPaid : null;
  const collateralCoverPct = i.proposedAmount > 0 && i.collateralValue > 0 ? (i.collateralValue / i.proposedAmount) * 100 : null;
  const flags: string[] = [];
  if (i.netProfit <= 0) flags.push('Net profit is zero or negative, which most lenders treat as a serious weakness.');
  if (basis !== null && basis < 1.25) flags.push('Combined DSCR is below 1.25, a level many lenders look for; reduce the loan amount, lengthen the tenure or improve profit before applying.');
  if (turnoverGrowthPct !== null && turnoverGrowthPct < 0) flags.push('Turnover fell compared with the previous year; be ready to explain why.');
  if (loanToTurnoverPct !== null && loanToTurnoverPct > 50) flags.push('The proposed loan is more than half of annual turnover, which may draw questions.');
  if (i.collateralValue <= 0) flags.push('No collateral value entered; check whether a guarantee scheme or collateral-free option applies to your lender and loan type.');
  if (i.turnoverPrevious <= 0) flags.push('Previous year turnover not entered; lenders usually compare at least two years.');
  return {
    cashAccrual: round2(cashAccrual), existingObligation: round2(existingObligation),
    existingDscr: existingDscr === null ? null : round2(existingDscr),
    proposedEmi: round2(proposedEmi), proposedAnnualService: round2(proposedAnnualService),
    combinedDscr: combinedDscr === null ? null : round2(combinedDscr), band,
    profitMarginPct: profitMarginPct === null ? null : round2(profitMarginPct),
    turnoverGrowthPct: turnoverGrowthPct === null ? null : round2(turnoverGrowthPct),
    loanToTurnoverPct: loanToTurnoverPct === null ? null : round2(loanToTurnoverPct),
    interestCover: interestCover === null ? null : round2(interestCover),
    collateralCoverPct: collateralCoverPct === null ? null : round2(collateralCoverPct),
    flags
  };
}

export const COMMON_LENDER_DOCUMENTS = [
  'KYC of proprietor/partners/directors (PAN, Aadhaar, address proof) and business PAN',
  'Udyam registration certificate',
  'Last 2-3 years income tax returns with computation of income',
  'Last 2-3 years financial statements (balance sheet and profit and loss), with audit report if audited',
  'Provisional financials for the current year',
  'Bank statements for all business accounts, usually the last 12 months',
  'GST registration and the last 12 months of GST returns',
  'Statement of existing loans with sanction letters and repayment schedules',
  'Debtor and creditor ageing and stock statement',
  'Business plan or projections showing how the loan will be repaid',
  'Proof of ownership or tenancy of business premises',
  'Collateral documents, if offered'
];
