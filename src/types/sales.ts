export interface Sale {
  id: string;
  customer: string;
  model: string;
  purchasePrice: number;
  sellingPrice: number;
  quantity: number;
  date: Date;
}

export interface SalesStats {
  totalRevenue: number;
  totalProfit: number;
  totalSales: number;
}
