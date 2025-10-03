export interface Sale {
  id: string;
  customer: string;
  model: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  date: Date;
  isPartnership?: boolean;
  partnerInvestment?: number;
  myInvestment?: number;
}

export interface SalesStats {
  totalRevenue: number;
  totalProfit: number;
  totalSales: number;
  totalInvestment: number;
}
