import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus } from "lucide-react";
import { Sale } from "@/types/sales";

interface AddSaleDialogProps {
  onAddSale: (sale: Omit<Sale, "id">) => void;
}

export const AddSaleDialog = ({ onAddSale }: AddSaleDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isPartnership, setIsPartnership] = useState<string>("alone");
  const [formData, setFormData] = useState({
    customer: "",
    model: "",
    purchasePrice: "",
    sellingPrice: "",
    quantity: "",
    myInvestment: "",
    partnerInvestment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const saleData: Omit<Sale, "id"> = {
      customer: formData.customer,
      model: formData.model,
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      quantity: parseInt(formData.quantity),
      date: new Date(),
    };

    if (isPartnership === "together") {
      saleData.isPartnership = true;
      saleData.myInvestment = parseFloat(formData.myInvestment);
      saleData.partnerInvestment = parseFloat(formData.partnerInvestment);
    }

    onAddSale(saleData);

    setFormData({
      customer: "",
      model: "",
      purchasePrice: "",
      sellingPrice: "",
      quantity: "",
      myInvestment: "",
      partnerInvestment: "",
    });
    setIsPartnership("alone");
    setOpen(false);
  };

  const calculatePartnerPercentages = () => {
    const myInv = parseFloat(formData.myInvestment) || 0;
    const partnerInv = parseFloat(formData.partnerInvestment) || 0;
    const total = myInv + partnerInv;
    
    if (total === 0) return { myPercent: 0, partnerPercent: 0 };
    
    return {
      myPercent: ((myInv / total) * 100).toFixed(1),
      partnerPercent: ((partnerInv / total) * 100).toFixed(1),
    };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" className="h-10 w-10">
          <Plus className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Nieuwe verkoop toevoegen</DialogTitle>
            <DialogDescription>
              Vul de gegevens in van de verkoop die je wilt toevoegen.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customer">Klant</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                placeholder="Naam van de klant"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="Product model"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Type verkoop</Label>
              <RadioGroup value={isPartnership} onValueChange={setIsPartnership}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="alone" id="alone" />
                  <Label htmlFor="alone" className="font-normal cursor-pointer">Alleen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="together" id="together" />
                  <Label htmlFor="together" className="font-normal cursor-pointer">Samen met iemand</Label>
                </div>
              </RadioGroup>
            </div>

            {isPartnership === "together" && (
              <div className="grid gap-4 p-4 rounded-lg bg-muted/50">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="myInvestment">Mijn investering</Label>
                    <Input
                      id="myInvestment"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.myInvestment}
                      onChange={(e) => setFormData({ ...formData, myInvestment: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="partnerInvestment">Partner investering</Label>
                    <Input
                      id="partnerInvestment"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.partnerInvestment}
                      onChange={(e) => setFormData({ ...formData, partnerInvestment: e.target.value })}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                {(formData.myInvestment || formData.partnerInvestment) && (
                  <div className="text-sm text-muted-foreground">
                    Verdeling: Jij {calculatePartnerPercentages().myPercent}% - Partner {calculatePartnerPercentages().partnerPercent}%
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="purchasePrice">Inkoopprijs</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sellingPrice">Verkoopprijs</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Aantal</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Verkoop toevoegen</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
