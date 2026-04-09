import { useNavigate } from "react-router-dom";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import StatsCard from "../../../components/Card/StatsCard";
import Button from "../../../components/Button/Button";
import ChannelPerformanceChart from "../../../components/Charts/ChannelPerformance/ChannelPerformanceChart";
import TotalViewsChart from "../../../components/Charts/TotalViews/TotalViewsChart";
import "./Dashboard.scss";
import { useDashboard } from "../../../hooks/useDashboard";
import BarChartIcon from "../../../assets/icons/bar-chart.svg?react";
import UsersIcon from "../../../assets/icons/users.svg?react";
import CardIcon from "../../../assets/icons/card.svg?react";

function fmt(n: number): string {
  return n.toLocaleString("nb-NO");
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, loading } = useDashboard();

  return (
    <SkeletonTheme baseColor="#ebebeb" highlightColor="#f5f5f5">
      <div className="dashboard">
        <div className="page-header">
          <div className="dashboard__header-row">
            <div>
              <h2>Dashboard</h2>
              <p className="subheading">
                View your data across all active campaigns
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard__stat-cards">
          <StatsCard
            icon={BarChartIcon}
            label="Active campaigns"
            value={data ? String(data.activeCampaigns) : "0"}
            isLoading={loading}
          />
          <StatsCard
            icon={UsersIcon}
            label="Reach"
            value={data ? fmt(data.totals.reach) : "0"}
            isLoading={loading}
          />
          <StatsCard
            icon={CardIcon}
            label="Ad spend"
            value={data ? `${fmt(data.totals.spend)} NOK` : "0 NOK"}
            isLoading={loading}
          />
        </div>

        <div className="dashboard__charts">
          <div className="dashboard__chart-card--large">
            <ChannelPerformanceChart data={data?.clicksByPlatform ?? []} />
          </div>
          <div className="dashboard__chart-card--medium">
            <TotalViewsChart data={data?.viewsTimeseries ?? []} />
          </div>
        </div>

        <div className="dashboard__cta-banner">
          <div className="text">
            <h3>Ready to launch a new campaign?</h3>
            <p>Create targeted job ads across multiple channels.</p>
          </div>
          <Button onClick={() => navigate("/orders/new")}>
            Create campaign
          </Button>
        </div>
      </div>
    </SkeletonTheme>
  );
}
