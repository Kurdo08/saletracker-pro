import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { SalesStats } from "@/types/sales";
import { StatsCard } from "@/components/StatsCard";
import { SalesTable } from "@/components/SalesTable";
import { AddSaleDialog } from "@/components/AddSaleDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Euro, ShoppingCart, LogOut, Wallet } from "lucide-react";

import { Sale } from "@/types/sales";

interface DbSale {
  id: string;
  customer: string;
  model: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
  created_at: string;
  is_partnership?: boolean;
  my_investment?: number;
  partner_investment?: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate("/auth");
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (session?.user) {
      fetchSales();
    }
  }, [session]);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedSales: Sale[] = (data as DbSale[]).map((sale) => ({
        id: sale.id,
        customer: sale.customer,
        model: sale.model,
        purchasePrice: Number(sale.purchase_price),
        sellingPrice: Number(sale.selling_price),
        quantity: sale.quantity,
        date: new Date(sale.created_at),
        isPartnership: sale.is_partnership,
        myInvestment: sale.my_investment ? Number(sale.my_investment) : undefined,
        partnerInvestment: sale.partner_investment ? Number(sale.partner_investment) : undefined,
      }));

      setSales(formattedSales);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fout bij laden",
        description: error.message,
      });
    }
  };

  const stats = useMemo<SalesStats>(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.sellingPrice * sale.quantity), 0);
    const totalProfit = sales.reduce((sum, sale) => 
      sum + ((sale.sellingPrice - sale.purchasePrice) * sale.quantity), 0
    );
    const totalSales = sales.length;
    const totalInvestment = sales.reduce((sum, sale) => sum + (sale.purchasePrice * sale.quantity), 0);

    return { totalRevenue, totalProfit, totalSales, totalInvestment };
  }, [sales]);

  const handleAddSale = async (newSale: Omit<Sale, "id">) => {
    if (!session?.user) return;

    try {
      const insertData: any = {
        user_id: session.user.id,
        customer: newSale.customer,
        model: newSale.model,
        purchase_price: newSale.purchasePrice,
        selling_price: newSale.sellingPrice,
        quantity: newSale.quantity,
      };

      if (newSale.isPartnership) {
        insertData.is_partnership = true;
        insertData.my_investment = newSale.myInvestment;
        insertData.partner_investment = newSale.partnerInvestment;
      }

      const { data, error } = await supabase
        .from("sales")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Verkoop toegevoegd!",
        description: "De verkoop is succesvol opgeslagen.",
      });

      await fetchSales();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fout bij opslaan",
        description: error.message,
      });
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      const { error } = await supabase
        .from("sales")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Verkoop verwijderd",
        description: "De verkoop is succesvol verwijderd.",
      });

      await fetchSales();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Fout bij verwijderen",
        description: error.message,
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">KS-010</h1>
          </div>
          <div className="flex gap-2">
            <AddSaleDialog onAddSale={handleAddSale} />
            <Button variant="outline" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatsCard
            title="Omzet"
            value={stats.totalRevenue.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
            icon={Euro}
          />
          <StatsCard
            title="Aantal"
            value={stats.totalSales.toString()}
            icon={ShoppingCart}
          />
          <StatsCard
            title="Winst"
            value={stats.totalProfit.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
            icon={TrendingUp}
            variant="success"
          />
          <StatsCard
            title="Investering"
            value={stats.totalInvestment.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
            icon={Wallet}
          />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Alle Verkopen</h2>
          <SalesTable sales={sales} onDelete={handleDeleteSale} />
        </div>
      </div>
    </div>
  );
};

export default Index;
