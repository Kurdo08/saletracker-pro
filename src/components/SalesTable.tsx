import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/sales";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Trash2 } from "lucide-react";

interface SalesTableProps {
  sales: Sale[];
  onDelete: (id: string) => void;
}

export const SalesTable = ({ sales, onDelete }: SalesTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("nl-NL", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const calculateTotal = (sale: Sale) => {
    return sale.sellingPrice * sale.quantity;
  };

  const calculateProfit = (sale: Sale) => {
    return (sale.sellingPrice - sale.purchasePrice) * sale.quantity;
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Klant</TableHead>
            <TableHead className="font-semibold">Model</TableHead>
            <TableHead className="font-semibold text-right">Inkoopprijs</TableHead>
            <TableHead className="font-semibold text-right">Verkoopprijs</TableHead>
            <TableHead className="font-semibold text-right">Aantal</TableHead>
            <TableHead className="font-semibold text-right">Totaal</TableHead>
            <TableHead className="font-semibold text-right">Winst</TableHead>
            <TableHead className="font-semibold">Datum</TableHead>
            <TableHead className="font-semibold text-right">Actie</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                Nog geen verkopen. Voeg je eerste verkoop toe!
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium">{sale.customer}</TableCell>
                <TableCell>{sale.model}</TableCell>
                <TableCell className="text-right">{formatCurrency(sale.purchasePrice)}</TableCell>
                <TableCell className="text-right">{formatCurrency(sale.sellingPrice)}</TableCell>
                <TableCell className="text-right">{sale.quantity}</TableCell>
                <TableCell className="text-right font-semibold">
                  {formatCurrency(calculateTotal(sale))}
                </TableCell>
                <TableCell className="text-right font-semibold text-success">
                  {formatCurrency(calculateProfit(sale))}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {format(sale.date, "dd MMM yyyy", { locale: nl })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(sale.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
