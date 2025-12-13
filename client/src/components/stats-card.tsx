import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  testId?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  testId,
}: StatsCardProps) {
  return (
    <Card className="hover-elevate transition-all duration-200" data-testid={testId}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground" data-testid={testId ? `${testId}-title` : undefined}>
              {title}
            </span>
            <span className="text-3xl font-bold tabular-nums" data-testid={testId ? `${testId}-value` : undefined}>
              {value}
            </span>
            {description && (
              <span className="text-xs text-muted-foreground">
                {description}
              </span>
            )}
            {trend && (
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
                data-testid={testId ? `${testId}-trend` : undefined}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}% from last month
              </span>
            )}
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
