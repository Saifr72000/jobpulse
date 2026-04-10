import { useState, useMemo } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { IOrder } from "../../../../api/orders";
import type { ReportingSummary } from "../../../../api/reporting";
import type { UseReportingResult } from "../../../../hooks/useReporting";
import Button from "../../../../components/Button/Button";
import UsersIcon from "../../../../assets/icons/users.svg?react";
import DemographicsChart from "../../../../components/Charts/Demographics/DemographicsChart";
import TimeseriesChart from "../../../../components/Charts/TimeSeries/TimeseriesChart";
import "./PerformanceCandidatesTab.scss";

interface KpiCardProps {
  label: string;
  value: string | number;
  isLoading?: boolean;
}

function KpiCard({ label, value, isLoading }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">
        {isLoading ? <Skeleton width={80} height={28} borderRadius={6} /> : value}
      </span>
    </div>
  );
}

/* const PERFORMANCE_KPIS: { label: string }[] = [
  { label: "Total views" },
  { label: "Reach" },
  { label: "Clicks" },
  { label: "Frequency" },
  { label: "Unique clicks" },
  { label: "Unique CTR" },
  { label: "Impressions" },
  { label: "Spend" },
]; */

function aggregateSummary(rows: ReportingSummary[]) {
  return rows.reduce(
    (acc, row) => ({
      impressions: acc.impressions + row.impressions,
      clicks: acc.clicks + row.clicks,
      reach: acc.reach + row.reach,
      spend: acc.spend + row.spend,
      frequency: (acc.frequency ?? 0) + (row.frequency ?? 0),
      uniqueClicks: (acc.uniqueClicks ?? 0) + (row.uniqueClicks ?? 0),
      uniqueCtr: (acc.uniqueCtr ?? 0) + (row.uniqueCtr ?? 0),
    }),
    {
      impressions: 0,
      clicks: 0,
      reach: 0,
      spend: 0,
      frequency: 0,
      uniqueClicks: 0,
      uniqueCtr: 0,
    },
  );
}

function fmt(n: number, decimals = 0): string {
  return n.toLocaleString("nb-NO", { maximumFractionDigits: decimals });
}

interface PerformanceCandidatesTabProps {
  order: IOrder;
  selectedChannel: string;
  onChannelChange: (channel: string) => void;
  fromDate: string;
  onFromDateChange: (date: string) => void;
  toDate: string;
  onToDateChange: (date: string) => void;
  onApply: (from: string, to: string) => void;
  reporting: UseReportingResult;
}

const CANDIDATE_KPIS: { label: string }[] = [
  { label: "Total candidates" },
  { label: "Contacted candidates" },
  { label: "Rejected candidates" },
];

export function PerformanceCandidatesTab({
  order,
  selectedChannel,
  onChannelChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  onApply,
  reporting,
}: PerformanceCandidatesTabProps) {
  const [dateError, setDateError] = useState("");

  const channels = useMemo(() => {
    const platforms = order.platformCampaigns?.map((c) => c.platform) ?? [];
    return ["All channels", ...Array.from(new Set(platforms))];
  }, [order.platformCampaigns]);

  const handleApply = () => {
    if (!fromDate || !toDate) {
      setDateError("Please select both a from and to date.");
      return;
    }
    if (fromDate > toDate) {
      setDateError('"From" date must be before "To" date.');
      return;
    }
    setDateError("");
    onApply(fromDate, toDate);
  };

  const { summary, timeSeries, demographics, loading, error } = reporting;

  const activeSummary = useMemo(() => {
    if (selectedChannel === "All channels") return summary;
    return summary.filter((s) => s.platform === selectedChannel);
  }, [summary, selectedChannel]);

  const activeTimeSeries = useMemo(() => {
    if (selectedChannel === "All channels") return timeSeries;
    return timeSeries.filter((t) => t.platform === selectedChannel);
  }, [timeSeries, selectedChannel]);

  const activeDemographics = useMemo(() => {
    if (selectedChannel === "All channels") return demographics;
    return demographics.filter((d) => d.platform === selectedChannel);
  }, [demographics, selectedChannel]);

  const kpis = useMemo(() => aggregateSummary(activeSummary), [activeSummary]);

  const performanceKpis = [
    { label: "Impressions", value: fmt(kpis.impressions) },
    { label: "Reach", value: fmt(kpis.reach) },
    { label: "Clicks", value: fmt(kpis.clicks) },
    { label: "Frequency", value: fmt(kpis.frequency ?? 0, 2) },
    { label: "Unique clicks", value: fmt(kpis.uniqueClicks ?? 0) },
    { label: "Unique CTR", value: `${fmt(kpis.uniqueCtr ?? 0, 2)}%` },
    { label: "Spend", value: `${fmt(kpis.spend, 2)} kr` },
  ];

  return (
    <SkeletonTheme baseColor="#ebebeb" highlightColor="#f5f5f5">
    <div className="performance-tab">
      {/* Performance section */}
      <div className="perf-section">
        <div className="perf-section-header">
          <h4>Performance</h4>
          <div className="filter-channel">
            <div className="filter-channel__select-wrapper">
              <select
                className="filter-channel__select"
                value={selectedChannel}
                onChange={(e) => onChannelChange(e.target.value)}
              >
                {channels.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-channel__date-wrapper">
              <span className="filter-channel__date-label">From</span>
              <input
                type="date"
                className="filter-channel__date"
                value={fromDate}
                onChange={(e) => onFromDateChange(e.target.value)}
              />
            </div>
            <div className="filter-channel__date-wrapper">
              <span className="filter-channel__date-label">To</span>
              <input
                type="date"
                className="filter-channel__date"
                value={toDate}
                onChange={(e) => onToDateChange(e.target.value)}
              />
            </div>
            <Button size="sm" onClick={handleApply} loading={loading}>
              Apply
            </Button>
          </div>
        </div>

        {dateError && <p className="perf-error">{dateError}</p>}

        <div className="kpi-grid">
          {performanceKpis.map((kpi) => (
            <KpiCard
              key={kpi.label}
              label={kpi.label}
              value={kpi.value}
              isLoading={loading}
            />
          ))}
        </div>

        {error && <p className="perf-error">Failed to load data: {error}</p>}

        <div className="charts-row">
          <DemographicsChart data={activeDemographics} isLoading={loading} />
          <TimeseriesChart data={activeTimeSeries} isLoading={loading} />
        </div>
      </div>

      {/* Candidates section */}
      <div className="perf-section">
        <h4>Candidates</h4>

        <div className="candidate-grid">
          {CANDIDATE_KPIS.map((kpi) => (
            <KpiCard key={kpi.label} label={kpi.label} value={0} />
          ))}
        </div>

        <div className="empty-state-panel card">
          <div className="empty-icon-box">
            <UsersIcon width={30} height={30} />
          </div>
          <p className="empty-title">No candidates yet</p>
          <p className="empty-body">
            Candidates will appear here once your campaign starts receiving
            applications.
          </p>
        </div>
      </div>
    </div>
    </SkeletonTheme>
  );
}
