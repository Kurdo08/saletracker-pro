import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description?: string;
  variant?: "default" | "success";
}

export const StatsCard = ({ title, value, icon: Icon, description, variant = "default" }: StatsCardProps) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${variant === "success" ? "text-success" : "text-primary"}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${variant === "success" ? "text-success" : ""}`}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
