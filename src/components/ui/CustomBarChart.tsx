"use client";

import { Activity, DollarSign } from "lucide-react";
import { Bar, BarChart, XAxis, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format } from "date-fns";

interface CustomBarChartProps {
  data: { date: string; transactions: number; volume: number }[];
  title: string;
}

const chartConfig = {
  transactions: {
    label: "Transactions",
    color: "#5a4fbf", 
    icon: Activity,
  },
  volume: {
    label: "Volume (৳)",
    color: "#c7e25b", 
    icon: DollarSign,
  },
} satisfies ChartConfig;

export function CustomBarChart({ data, title }: CustomBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => format(new Date(value), "MMM d")}
            />
            <Bar
              dataKey="transactions"
              stackId="a"
              fill="var(--color-transactions)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="volume"
              stackId="a"
              fill="var(--color-volume)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              cursor={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}