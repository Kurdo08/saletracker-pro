import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sale } from "@/types/sales";
import { DailySalesOverview } from "@/components/DailySalesOverview";
import { SalesTable } from "@/components/SalesTable";
import { AddSaleDialog } from "@/components/AddSaleDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SalesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sales, setSales] = useState<Sale[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedSales: Sale[] = data.map((sale) => ({
        id: sale.id,
        customer: sale.customer,
        model: sale.model,
        purchasePrice: Number(sale.purchase_price),
        sellingPrice: Number(sale.selling_price),
        quantity: sale.quantity,
        date: new Date(sale.created_at),
        isPartnership: sale.is_partnership || false,
        partnerInvestment: sale.partner_investment ? Number(sale.partner_investment) : undefined,
        myInvestment: sale.my_investment ? Number(sale.my_investment) : undefined,
      }));

      setSales(formattedSales);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het ophalen van verkopen.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSale = async (newSale: Omit<Sale, "id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "Je moet ingelogd zijn om een verkoop toe te voegen.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("sales").insert({
        user_id: user.id,
        customer: newSale.customer,
        model: newSale.model,
        purchase_price: newSale.purchasePrice,
        selling_price: newSale.sellingPrice,
        quantity: newSale.quantity,
        is_partnership: newSale.isPartnership || false,
        partner_investment: newSale.partnerInvestment,
        my_investment: newSale.myInvestment,
      });

      if (error) throw error;

      toast({
        title: "Gelukt!",
        description: "Verkoop succesvol toegevoegd.",
      });

      fetchSales();
    } catch (error) {
      console.error("Error adding sale:", error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het toevoegen van de verkoop.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSale = async (id: string) => {
    try {
      const { error } = await supabase.from("sales").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Verwijderd",
        description: "Verkoop succesvol verwijderd.",
      });

      setSales((prevSales) => prevSales.filter((sale) => sale.id !== id));
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het verwijderen van de verkoop.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Zelf Verkopen</h1>
          </div>
          <AddSaleDialog onAddSale={handleAddSale} />
        </div>

        <div className="mb-6">
          <DailySalesOverview sales={sales} />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Alle Verkopen</h2>
          <SalesTable sales={sales} onDelete={handleDeleteSale} />
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
