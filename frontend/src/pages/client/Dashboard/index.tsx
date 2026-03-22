import { useNavigate } from "react-router-dom";
import StatsCard from "../../../components/Card/StatsCard";
import "./Dashboard.scss";
import BarChartIcon from "../../../assets/icons/bar-chart.svg?react";
import UsersIcon from "../../../assets/icons/users.svg?react";
import CardIcon from "../../../assets/icons/card.svg?react";

const imgTrophy =
  "https://www.figma.com/api/mcp/asset/8401e075-e788-4ca4-aa11-a8ec94f401c1";
const imgForward =
  "https://www.figma.com/api/mcp/asset/a366f735-6d89-446a-96d1-4dd85c157ab9";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="page-header">
        <h2>Dashboard</h2>
        <p className="subheading">View your data across all active campaigns</p>
      </div>

      {/* Stat Cards */}
      <div className="dashboard__stat-cards">
        <StatsCard icon={BarChartIcon} label="Active campaigns" value="3" />
        <StatsCard icon={UsersIcon} label="Applications received" value="25" />
        <StatsCard icon={CardIcon} label="Ad spend" value="150 000 NOK" />
      </div>

      {/* Charts Section */}
      <div className="dashboard__charts">
        {/* Bar Chart */}
        <div className="dashboard__chart-card dashboard__chart-card--large">
          {/* <h2>Total views per week</h2>
          <p className="subtitle">All campaigns</p>
          <div className="dashboard__bar-chart">
            {weeklyData.map((d) => (
              <div key={d.week} className="bar-group">
                <div className="bar-container">
                  {d.tooltip && (
                    <div className="tooltip">
                      <span>{d.tooltip}</span>
                      <span className="dot" />
                    </div>
                  )}
                  <div className="bar" style={{ height: `${d.height}%` }} />
                </div>
                <span className="week-label">{d.week}</span>
              </div>
            ))}
          </div> */}
        </div>

        {/* Channel Performance */}
        {/* <div className="dashboard__chart-card dashboard__chart-card--medium">
          <h2>Channel performance</h2>
          <div className="dashboard__channel-banner">
            <img src={imgTrophy} alt="" />
            <span>Facebook is leading on channel performance</span>
          </div>
          <div className="dashboard__channel-list">
            {channels.map((ch) => (
              <div key={ch.name} className="channel-item">
                <span className="name">{ch.name}</span>
                <div className="bar-row">
                  <div className="bar" style={{ width: ch.width }} />
                  <span className="percent">{ch.percent}</span>
                </div>
              </div>
            ))}
          </div>
        </div> */}
      </div>

      {/* Campaign Banner */}
      <div className="dashboard__cta-banner">
        <div className="text">
          <h3>Ready to launch a new campaign?</h3>
          <p>Create targeted job ads across multiple channels.</p>
        </div>
        <button className="btn" onClick={() => navigate("/orders/new")}>
          Create campaign
          <img src={imgForward} alt="" />
        </button>
      </div>
    </div>
  );
}
