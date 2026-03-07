import { Sidebar } from "../components/Sidebar";
import "./Dashboard.css";

// Figma asset URLs (valid for 7 days from design export)
const imgCommercial =
  "https://www.figma.com/api/mcp/asset/7c968a00-0475-4ace-bb0f-db12d6205898";
const imgGroup =
  "https://www.figma.com/api/mcp/asset/33534bc9-ee6b-429f-84b8-96353e051e9c";
const imgCoins =
  "https://www.figma.com/api/mcp/asset/e47ffc2c-2982-43df-9259-d73dae6d1693";
const imgTrophy =
  "https://www.figma.com/api/mcp/asset/8401e075-e788-4ca4-aa11-a8ec94f401c1";
const imgForward =
  "https://www.figma.com/api/mcp/asset/a366f735-6d89-446a-96d1-4dd85c157ab9";

const weeklyData = [
  { week: "W1", height: 62 },
  { week: "W2", height: 50 },
  { week: "W3", height: 26 },
  { week: "W4", height: 57 },
  { week: "W5", height: 68 },
  { week: "W6", height: 93, tooltip: "32% increase" },
];

const channels = [
  { name: "Facebook", percent: "55%", width: "100%" },
  { name: "LinkedIn", percent: "32%", width: "94%" },
  { name: "Snapchat", percent: "32%", width: "64%" },
  { name: "TikTok", percent: "32%", width: "56%" },
  { name: "X", percent: "32%", width: "38%" },
  { name: "Schibsted", percent: "32%", width: "20%" },
];

interface Props {
  onNavigate: (page: string) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  return (
    <div className="dashboard">
      <Sidebar activePage="dashboard" onNavigate={onNavigate} />

      <div className="dashboard-content">
        {/* ── Header ── */}
        <header className="dashboard-header">
          {/* <div className="header-title"></div> */}

          {/*  <div className="user-profile">
            <div className="user-avatar">JD</div>
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-role">Customer</span>
            </div>
            <img src={imgExpandArrow} alt="" className="expand-arrow" />
          </div> */}
        </header>

        {/* ── Stat Cards ── */}
        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: "#d5e9fc" }}>
              <img src={imgCommercial} alt="Active campaigns" />
            </div>
            <p className="stat-label">Active campaigns</p>
            <div className="stat-footer">
              <span className="stat-value">3</span>
              <button
                className="stat-arrow-btn"
                aria-label="View active campaigns"
              >
                ↗
              </button>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: "#fcd5f7" }}>
              <img src={imgGroup} alt="Applications received" />
            </div>
            <p className="stat-label">Applications received</p>
            <div className="stat-footer">
              <span className="stat-value">25</span>
              <button className="stat-arrow-btn" aria-label="View applications">
                ↗
              </button>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrap" style={{ background: "#ddff9d" }}>
              <img src={imgCoins} alt="Spend" />
            </div>
            <p className="stat-label">Spend</p>
            <div className="stat-footer">
              <span className="stat-value spend-value">150 000 NOK</span>
              <button className="stat-arrow-btn" aria-label="View spend">
                ↗
              </button>
            </div>
          </div>
        </div>

        {/* ── Charts ── */}
        <div className="charts-section">
          {/* Bar Chart */}
          <div className="chart-card">
            <h2 className="chart-title">Total views per week</h2>
            <p className="chart-subtitle">All campaigns</p>

            <div className="bar-chart">
              {weeklyData.map((d) => (
                <div key={d.week} className="bar-column">
                  <div className="bar-area">
                    {d.tooltip && (
                      <div className="bar-tooltip-wrap">
                        <span className="bar-tooltip">{d.tooltip}</span>
                        <span className="bar-dot" />
                      </div>
                    )}
                    <div className="bar" style={{ height: `${d.height}%` }} />
                  </div>
                  <span className="bar-label">{d.week}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Performance */}
          <div className="channel-card">
            <h2 className="channel-title">Channel performance</h2>

            <div className="channel-highlight">
              <img src={imgTrophy} alt="" className="trophy-icon" />
              <span>Facebook is leading on channel performance</span>
            </div>

            <div className="channel-list">
              {channels.map((ch) => (
                <div key={ch.name} className="channel-row">
                  <span className="channel-name">{ch.name}</span>
                  <div className="channel-bar-wrap">
                    <div className="channel-bar" style={{ width: ch.width }} />
                    <span className="channel-percent">{ch.percent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Campaign Banner ── */}
        <div className="campaign-banner">
          <div className="banner-text">
            <h3>Ready to launch a new campaign?</h3>
            <p>Create targeted job ads across multiple channels.</p>
          </div>
          <button className="create-btn">
            Create campaign
            <img src={imgForward} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
