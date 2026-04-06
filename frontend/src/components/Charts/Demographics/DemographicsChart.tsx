import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ReportingDemographic } from "../../../api/reporting";
import "./DemographicsChart.scss";

interface PivotedRow {
  ageGroup: string;
  female: number;
  male: number;
}

function pivotDemographics(data: ReportingDemographic[]): PivotedRow[] {
  const map = new Map<string, PivotedRow>();
  for (const row of data) {
    const age = row.age ?? "Unknown";
    if (!map.has(age)) {
      map.set(age, { ageGroup: age, female: 0, male: 0 });
    }
    const entry = map.get(age)!;
    if (row.gender === "female") entry.female += row.clicks;
    if (row.gender === "male") entry.male += row.clicks;
  }
  return Array.from(map.values());
}

interface DemographicsChartProps {
  data: ReportingDemographic[];
}

const DemographicsChart = ({ data }: DemographicsChartProps) => {
  const chartData = pivotDemographics(data);

  return (
    <div className="demographics-card">
      <div className="demographics-card__header">
        <h4>Demographics</h4>
        <p className="body-2">Clicks by age and gender</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          barGap={12}
          barSize={35}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--chart-grid)"
          />
          <XAxis
            dataKey="ageGroup"
            tick={{ fontSize: 12, fill: "var(--chart-axis-tick)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--chart-axis-tick)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--chart-tooltip-cursor)" }}
            contentStyle={{
              borderRadius: 12,
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            formatter={(value) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
          <Bar
            dataKey="female"
            fill="var(--chart-bar-female)"
            radius={[10, 10, 10, 10]}
          />
          <Bar
            dataKey="male"
            fill="var(--chart-bar-male)"
            radius={[10, 10, 10, 10]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DemographicsChart;
