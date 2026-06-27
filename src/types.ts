export type Side = 'BUY' | 'SELL';
export type AssetClass = 'Equity' | 'Fixed Income' | 'ETF' | 'Option' | 'Mutual Fund' | 'Cash';
export type TradeStatus = 'Pending' | 'Executed' | 'Cancelled' | 'Failed';

export interface Trade {
  id: string;
  timestamp: string;
  symbol: string;
  side: Side;
  quantity: number;
  price: number;
  assetClass: AssetClass;
  account: string;
  advisor: string;
  status: TradeStatus;
  notes: string;
}

export type SortField = keyof Trade;
export type SortDir = 'asc' | 'desc';
