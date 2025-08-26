"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface CustomPieChartProps {
  totalUsers: number;
  totalAgents: number;
  title?: string;
  description?: string;
}

const chartConfig = {
  users: {
    label: "Users",
    color: "#bfa34d",
  },
  agents: {
    label: "Agents",
    color: "#4a90e2",
  },
} satisfies ChartConfig;

export function CustomPieChart({
  totalUsers,
  totalAgents,
  title = "User vs Agent Distribution",
  description = "Showing the distribution of users and agents",
}: CustomPieChartProps) {
  const chartData = [
    { name: "Users", value: totalUsers, fill: chartConfig.users.color },
    { name: "Agents", value: totalAgents, fill: chartConfig.agents.color },
  ];

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" label nameKey="name" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}