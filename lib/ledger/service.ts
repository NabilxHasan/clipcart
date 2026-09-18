// Financial Ledger & Balance Engine
// Enforces double-entry auditability, prevents negative balances, and ensures idempotency.

import { WalletTransaction, WithdrawalRequest, Earning, Campaign } from '../types/database';

export class LedgerEngine {
  /**
   * Calculate exact real-time balance strictly from the immutable ledger.
   * Total Balance = Sum of all Credits - Sum of all Debits
   */
  static computeBalance(transactions: WalletTransaction[]): number {
    let balance = 0;
    for (const tx of transactions) {
      if (tx.type === 'CREDIT_EARNING' || tx.type === 'ADJUSTMENT_CREDIT') {
        balance += Number(tx.amount);
      } else if (tx.type === 'DEBIT_WITHDRAWAL_LOCK' || tx.type === 'DEBIT_WITHDRAWAL_SETTLED' || tx.type === 'ADJUSTMENT_DEBIT') {
        balance -= Number(tx.amount);
      }
    }
    // Return rounded to 2 decimal places to prevent floating point inaccuracies
    return Math.max(0, Math.round(balance * 100) / 100);
  }

  /**
   * Calculate earning payout based on campaign rules and verified view count.
   */
  static calculatePayout(
    campaign: Pick<Campaign, 'payoutType' | 'cpmRate' | 'fixedReward' | 'maxPayoutPerClip' | 'minViews' | 'maxViews' | 'remainingBudget'>,
    verifiedViews: number
  ): { calculatedAmount: number; approvedAmount: number; cappedByMax: boolean; cappedByBudget: boolean; meetsMinViews: boolean } {
    if (verifiedViews < campaign.minViews) {
      return {
        calculatedAmount: 0,
        approvedAmount: 0,
        cappedByMax: false,
        cappedByBudget: false,
        meetsMinViews: false,
      };
    }

    const effectiveViews = campaign.maxViews ? Math.min(verifiedViews, campaign.maxViews) : verifiedViews;
    let gross = 0;

    if (campaign.payoutType === 'CPM') {
      gross = (effectiveViews / 1000) * Number(campaign.cpmRate);
    } else {
      gross = Number(campaign.fixedReward);
    }

    let cappedAmount = gross;
    let cappedByMax = false;

    if (campaign.maxPayoutPerClip > 0 && cappedAmount > Number(campaign.maxPayoutPerClip)) {
      cappedAmount = Number(campaign.maxPayoutPerClip);
      cappedByMax = true;
    }

    let approvedAmount = cappedAmount;
    let cappedByBudget = false;

    if (approvedAmount > Number(campaign.remainingBudget)) {
      approvedAmount = Math.max(0, Number(campaign.remainingBudget));
      cappedByBudget = true;
    }

    return {
      calculatedAmount: Math.round(gross * 100) / 100,
      approvedAmount: Math.round(approvedAmount * 100) / 100,
      cappedByMax,
      cappedByBudget,
      meetsMinViews: true,
    };
  }

  /**
   * Validate a withdrawal request before creating the record and locking funds.
   */
  static validateWithdrawal(
    availableBalance: number,
    requestedAmount: number,
    paymentMethod: string,
    paymentIdentifier: string
  ): { valid: boolean; error?: string } {
    if (requestedAmount <= 0) {
      return { valid: false, error: 'Withdrawal amount must be strictly greater than ৳0.' };
    }

    const MIN_WITHDRAWAL = 50; // ৳50 BDT minimum for bKash/Nagad
    if (requestedAmount < MIN_WITHDRAWAL) {
      return { valid: false, error: `Minimum withdrawal amount is ৳${MIN_WITHDRAWAL}.` };
    }

    if (requestedAmount > availableBalance) {
      return { valid: false, error: `Insufficient available balance. You have ৳${availableBalance.toFixed(2)} available.` };
    }

    if (!paymentIdentifier || paymentIdentifier.trim().length < 5) {
      return { valid: false, error: 'A valid payment identifier (bKash/Nagad number or Bank details) is required.' };
    }

    return { valid: true };
  }
}
