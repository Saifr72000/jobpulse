import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import BarChartIcon from "../../../assets/icons/bar-chart.svg?react";
import Icon from "../../Icon/Icon";
import "./ChannelPerformanceChart.scss";

interface ChannelPerformanceChartProps {
  data: { platform: string; clicks: number }[];
}

const ChannelPerformanceChart = ({ data }: ChannelPerformanceChartProps) => {
  return (
    <div className="channel-performance-card">
      {data.length > 0 && (
        <div className="channel-performance-card__header">
          <h4>Channel performance</h4>
          <p className="body-2">Clicks per platform</p>
        </div>
      )}
      {data.length === 0 ? (
        <div className="channel-performance-card__empty">
          <div className="channel-performance-card__empty-icon">
            <Icon svg={BarChartIcon} size={22} />
          </div>
          <h4>Channel performance</h4>
          <p className="body-2">
            Channel performance will appear once your campaigns start receiving impressions.
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 24, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--chart-grid)"
            />
            <XAxis
              dataKey="platform"
              tick={{ fontSize: 12, fill: "var(--chart-axis-tick)" }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
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
              cursor={{ fill: "var(--chart-tooltip-cursor)" }}
            />
            <Bar
              dataKey="clicks"
              fill="var(--chart-bar-primary)"
              radius={[6, 6, 0, 0]}
              maxBarSize={68}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ChannelPerformanceChart;
