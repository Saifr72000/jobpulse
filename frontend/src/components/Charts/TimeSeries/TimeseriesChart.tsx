import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { ReportingTimeSeriesPoint } from "../../../api/reporting";
import "./TimeseriesChart.scss";

interface AggregatedPoint {
  date: string;
  clicks: number;
}

function aggregateByDate(data: ReportingTimeSeriesPoint[]): AggregatedPoint[] {
  const map = new Map<string, number>();
  for (const point of data) {
    map.set(point.date, (map.get(point.date) ?? 0) + point.clicks);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, clicks]) => ({ date, clicks }));
}

function getTickInterval(pointCount: number): number {
  if (pointCount <= 7) return 0;
  if (pointCount <= 14) return 1;
  if (pointCount <= 30) return 2;
  if (pointCount <= 60) return 6;
  return 13;
}

function formatXDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

interface TimeseriesChartProps {
  data: ReportingTimeSeriesPoint[];
  isLoading?: boolean;
}

const TimeseriesChart = ({ data, isLoading = false }: TimeseriesChartProps) => {
  const chartData = aggregateByDate(data);
  const interval = getTickInterval(chartData.length);

  if (isLoading) {
    return (
      <div className="timeseries-card">
        <Skeleton height={340} borderRadius={12} />
      </div>
    );
  }

  return (
    <div className="timeseries-card">
      <div className="timeseries-card__header">
        <h4>Clicks</h4>
        <p className="body-2">Total clicks over time</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={chartData}
          margin={{ top: 8, right: 24, left: -16, bottom: 0 }}
        >
          <defs>
            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--chart-area-stroke)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--chart-area-stroke)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--chart-grid)"
          />
          <XAxis
            dataKey="date"
            interval={interval}
            tickFormatter={formatXDate}
            tick={{ fontSize: 11, fill: "var(--chart-axis-tick)" }}
            tickMargin={10}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--chart-axis-tick)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="var(--chart-area-stroke)"
            fill="url(#clicksGradient)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeseriesChart;
