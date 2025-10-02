import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calculator as CalculatorIcon } from "lucide-react";

export const Calculator = () => {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "×":
        return a * b;
      case "÷":
        return a / b;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay("0.");
      setNewNumber(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <CalculatorIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px]">
        <DialogHeader>
          <DialogTitle>Rekenmachine</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <div className="bg-muted rounded-lg p-4 text-right text-2xl font-bold h-16 flex items-center justify-end overflow-hidden">
            {display}
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="destructive" onClick={handleClear} className="col-span-2">
              C
            </Button>
            <Button variant="secondary" onClick={() => handleOperation("÷")}>
              ÷
            </Button>
            <Button variant="secondary" onClick={() => handleOperation("×")}>
              ×
            </Button>
            
            <Button variant="outline" onClick={() => handleNumber("7")}>
              7
            </Button>
            <Button variant="outline" onClick={() => handleNumber("8")}>
              8
            </Button>
            <Button variant="outline" onClick={() => handleNumber("9")}>
              9
            </Button>
            <Button variant="secondary" onClick={() => handleOperation("-")}>
              -
            </Button>
            
            <Button variant="outline" onClick={() => handleNumber("4")}>
              4
            </Button>
            <Button variant="outline" onClick={() => handleNumber("5")}>
              5
            </Button>
            <Button variant="outline" onClick={() => handleNumber("6")}>
              6
            </Button>
            <Button variant="secondary" onClick={() => handleOperation("+")}>
              +
            </Button>
            
            <Button variant="outline" onClick={() => handleNumber("1")}>
              1
            </Button>
            <Button variant="outline" onClick={() => handleNumber("2")}>
              2
            </Button>
            <Button variant="outline" onClick={() => handleNumber("3")}>
              3
            </Button>
            <Button variant="default" onClick={handleEquals} className="row-span-2">
              =
            </Button>
            
            <Button variant="outline" onClick={() => handleNumber("0")} className="col-span-2">
              0
            </Button>
            <Button variant="outline" onClick={handleDecimal}>
              .
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
