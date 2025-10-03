import { Sale } from "@/types/sales";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { nl } from "date-fns/locale";

interface DailySalesOverviewProps {
  sales: Sale[];
}

interface DailySale {
  date: string;
  totalQuantity: number;
  customers: string[];
}

export function DailySalesOverview({ sales }: DailySalesOverviewProps) {
  // Group sales by date
  const dailySales = sales.reduce((acc: Record<string, DailySale>, sale) => {
    const dateKey = format(sale.date, "d MMM", { locale: nl });
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        totalQuantity: 0,
        customers: [],
      };
    }
    
    acc[dateKey].totalQuantity += sale.quantity;
    if (!acc[dateKey].customers.includes(sale.customer)) {
      acc[dateKey].customers.push(sale.customer);
    }
    
    return acc;
  }, {});

  // Convert to array and sort by date (most recent first)
  const sortedDailySales = Object.values(dailySales).reverse();

  if (sortedDailySales.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Zelf Verkopen</h2>
      <div className="space-y-3">
        {sortedDailySales.map((daily, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
            <div className="flex-1">
              <p className="font-medium">{daily.date}</p>
              <p className="text-sm text-muted-foreground">
                {daily.customers.join(", ")}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{daily.totalQuantity} stuks</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
