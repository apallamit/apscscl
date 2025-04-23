import { useRef, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartData } from "@/types";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface LineChartComponentProps {
  title: string;
  series: {
    name: string;
    data: ChartData[];
    color: string;
  };
  yAxisLabel?: string;
  yAxisFormatter?: (value: number) => string;
}

export function LineChartComponent({ 
  title, 
  series,
  yAxisLabel = "",
  yAxisFormatter = (value) => `${value}`
}: LineChartComponentProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <div className="text-sm text-gray-500">Loading chart...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</CardTitle>
        <div className="flex items-center text-xs text-primary">
          <span className="text-xs">{series.name}</span>
        </div>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={series.data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id={`gradient-${series.name}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={series.color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={series.color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value}
              tick={{ fontSize: 10 }}
              style={{ 
                fontSize: '10px',
                fontFamily: 'Inter, sans-serif',
                color: 'rgba(107, 114, 128, 0.8)'
              }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => yAxisFormatter(value)}
              tick={{ fontSize: 10 }}
              style={{ 
                fontSize: '10px',
                fontFamily: 'Inter, sans-serif',
                color: 'rgba(107, 114, 128, 0.8)'
              }}
            />
            <Tooltip 
              formatter={(value) => [yAxisFormatter(Number(value)), series.name]}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                fontSize: '12px',
                fontFamily: 'Inter, sans-serif',
                padding: '8px 12px'
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={series.color}
              strokeWidth={2}
              activeDot={{ r: 4, strokeWidth: 1, fill: 'white' }}
              dot={{ r: 3, strokeWidth: 1, fill: 'white' }}
              name={series.name}
              fill={`url(#gradient-${series.name})`}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
