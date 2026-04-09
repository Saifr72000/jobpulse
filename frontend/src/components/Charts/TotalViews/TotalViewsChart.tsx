import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BarChartIcon from "../../../assets/icons/bar-chart.svg?react";
import Icon from "../../Icon/Icon";
import "./TotalViewsChart.scss";

interface TotalViewsChartProps {
  data: { date: string; impressions: number }[];
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

const TotalViewsChart = ({ data }: TotalViewsChartProps) => {
  const interval = getTickInterval(data.length);

  return (
    <div className="total-views-card">
      {data.length > 0 && (
        <div className="total-views-card__header">
          <h4>Total views</h4>
          <p className="body-2">Views across all platforms</p>
        </div>
      )}
      {data.length === 0 ? (
        <div className="total-views-card__empty">
          <div className="total-views-card__empty-icon">
            <Icon svg={BarChartIcon} size={22} />
          </div>
          <h4>Total views</h4>
          <p className="body-2">
            Views across platforms will appear once your campaigns start receiving impressions.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart
            data={data}
            margin={{ top: 8, right: 24, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
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
              dataKey="impressions"
              stroke="var(--chart-area-stroke)"
              fill="url(#viewsGradient)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TotalViewsChart;
