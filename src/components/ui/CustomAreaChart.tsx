"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { format } from "date-fns";

type Props = {
  data: { date: string; value: number }[];
  title: string;
  description: string;
  filterType: "lifetime" | "last7days" | "last30days" | "custom" | "specificDate";
  startDate?: Date;
  endDate?: Date;
};

export function CustomAreaChart({ data, title, description, filterType, startDate, endDate }: Props) {
  const chartConfig = {
    value: {
      label: "Value",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;


  let trendText = "";
  let TrendIcon = TrendingUp;
   if (data.length >= 2) {
    const first = data[0].value;
    const last = data[data.length - 1].value;
    if (first === 0) {
      trendText = "Insufficient comparable data";
    } else {
      const percentage = (((last - first) / first) * 100).toFixed(1);
      if (last > first) {
        trendText = `Trending up by ${percentage}% this period`;
      } else if (last < first) {
        trendText = `Trending down by ${Math.abs(Number(percentage))}% this period`;
        TrendIcon = TrendingDown;
      } else {
        trendText = "No change this period";
      }
    }
  } else {
    trendText = "Insufficient data for trend";
  }

  let dateRange = "";
  if (filterType === "custom" && startDate && endDate) {
    dateRange = `${format(startDate, "MMM d, yyyy")} - ${format(endDate, "MMM d, yyyy")}`;
  } else if (filterType === "last7days" && data.length > 0) {
    dateRange = `Last 7 Days: ${format(new Date(data[0].date), "MMM d, yyyy")} - ${format(new Date(data[data.length - 1].date), "MMM d, yyyy")}`;
  } else if (filterType === "last30days" && data.length > 0) {
    dateRange = `Last 30 Days: ${format(new Date(data[0].date), "MMM d, yyyy")} - ${format(new Date(data[data.length - 1].date), "MMM d, yyyy")}`;
  } else if (filterType === "lifetime" && data.length > 0) {
    dateRange = `Lifetime: ${format(new Date(data[0].date), "MMM d, yyyy")} - ${format(new Date(data[data.length - 1].date), "MMM d, yyyy")}`;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => format(new Date(value), "MMM d")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="value"
              type="natural"
              fill="var(--color-value)"
              fillOpacity={0.4}
              stroke="var(--color-value)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              {trendText} <TrendIcon className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              {dateRange}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}