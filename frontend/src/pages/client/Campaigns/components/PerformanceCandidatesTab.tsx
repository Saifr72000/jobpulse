import { useState } from "react";
import type { IOrder } from "../../../../api/orders";
import BarChartIcon from "../../../../assets/icons/bar-chart.svg?react";
import UsersIcon from "../../../../assets/icons/users.svg?react";
import SettingsIcon from "../../../../assets/icons/settings.svg?react";
import "./PerformanceCandidatesTab.scss";

interface KpiCardProps {
  label: string;
  value: string | number;
}

function KpiCard({ label, value }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <span className="kpi-label">{label}</span>
      <span className="kpi-value">{value}</span>
    </div>
  );
}

interface PerformanceCandidatesTabProps {
  order: IOrder;
}

const PERFORMANCE_KPIS: { label: string }[] = [
  { label: "Total views" },
  { label: "Reach" },
  { label: "Clicks" },
  { label: "Frequency" },
  { label: "Unique clicks" },
  { label: "Unique CTR" },
  { label: "Applications" },
  { label: "Spend" },
];

const CANDIDATE_KPIS: { label: string }[] = [
  { label: "Total candidates" },
  { label: "Contacted candidates" },
  { label: "Rejected candidates" },
];

const CHANNELS = [
  "All channels",
  "LinkedIn",
  "Facebook",
  "Google",
  "Snapchat",
  "Instagram",
];

export function PerformanceCandidatesTab({
  order: _order,
}: PerformanceCandidatesTabProps) {
  const [selectedChannel, setSelectedChannel] = useState("All channels");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  return (
    <div className="performance-tab">
      {/* Performance section */}
      <div className="perf-section">
        <div className="perf-section-header">
          <h4>Performance</h4>
          <div className="filter-channel">
            {/* <SettingsIcon width={16} height={16} /> */}
            {/* <span className="filter-channel__label">Filter channel</span> */}
            <div className="filter-channel__select-wrapper">
              <select
                className="filter-channel__select"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
              >
                {CHANNELS.map((ch) => (
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
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="filter-channel__date-wrapper">
              <span className="filter-channel__date-label">To</span>
              <input
                type="date"
                className="filter-channel__date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="kpi-grid">
          {PERFORMANCE_KPIS.map((kpi) => (
            <KpiCard key={kpi.label} label={kpi.label} value={0} />
          ))}
        </div>

        <div className="empty-state-panel card">
          <div className="empty-icon-box">
            <BarChartIcon width={30} height={30} />
          </div>
          <p className="empty-title">Waiting for data</p>
          <p className="empty-body">
            Performance data will appear here as your campaign starts receiving
            impressions.
          </p>
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
  );
}
