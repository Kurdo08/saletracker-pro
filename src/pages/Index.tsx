import { useState, useMemo } from "react";
import { Sale, SalesStats } from "@/types/sales";
import { StatsCard } from "@/components/StatsCard";
import { SalesTable } from "@/components/SalesTable";
import { AddSaleDialog } from "@/components/AddSaleDialog";
import { TrendingUp, Euro, ShoppingCart } from "lucide-react";

const Index = () => {
  const [sales, setSales] = useState<Sale[]>([
    {
      id: "1",
      customer: "Jan Jansen",
      model: "Model X-100",
      purchasePrice: 50,
      sellingPrice: 75,
      quantity: 2,
      date: new Date(2025, 9, 1),
    },
    {
      id: "2",
      customer: "Marie de Vries",
      model: "Model Pro-200",
      purchasePrice: 120,
      sellingPrice: 180,
      quantity: 1,
      date: new Date(2025, 9, 15),
    },
    {
      id: "3",
      customer: "Piet Bakker",
      model: "Model X-100",
      purchasePrice: 50,
      sellingPrice: 75,
      quantity: 3,
      date: new Date(2025, 9, 20),
    },
  ]);

  const stats = useMemo<SalesStats>(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.sellingPrice * sale.quantity), 0);
    const totalProfit = sales.reduce((sum, sale) => 
      sum + ((sale.sellingPrice - sale.purchasePrice) * sale.quantity), 0
    );
    const totalSales = sales.length;

    return { totalRevenue, totalProfit, totalSales };
  }, [sales]);

  const handleAddSale = (newSale: Omit<Sale, "id">) => {
    const sale: Sale = {
      ...newSale,
      id: Date.now().toString(),
    };
    setSales([sale, ...sales]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Verkoopoverzicht</h1>
              <p className="text-muted-foreground">
                Overzicht van al je verkopen, winsten en klanten
              </p>
            </div>
            <AddSaleDialog onAddSale={handleAddSale} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatsCard
            title="Totale Omzet"
            value={formatCurrency(stats.totalRevenue)}
            icon={Euro}
            description="Alle verkopen bij elkaar"
          />
          <StatsCard
            title="Totale Winst"
            value={formatCurrency(stats.totalProfit)}
            icon={TrendingUp}
            description="Netto winst na inkoop"
            variant="success"
          />
          <StatsCard
            title="Aantal Verkopen"
            value={stats.totalSales.toString()}
            icon={ShoppingCart}
            description="Totaal aantal transacties"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Alle Verkopen</h2>
          <SalesTable sales={sales} />
        </div>
      </div>
    </div>
  );
};

export default Index;
