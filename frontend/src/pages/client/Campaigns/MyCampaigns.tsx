import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { CampaignsTable, type Campaign } from "./components/CampaignsTable";
import "./MyCampaigns.scss";

const PAGE_SIZE = 20;

export default function MyCampaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchCampaigns(page);
  }, [page]);

  async function fetchCampaigns(p: number) {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/orders/my-orders?page=${p}&limit=${PAGE_SIZE}`,
      );
      const list: Campaign[] = Array.isArray(data)
        ? data
        : (data.orders ?? data.data ?? []);
      setCampaigns(list);
      setHasMore(list.length === PAGE_SIZE);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="campaigns-page">
      <div className="campaigns-page__header">
        <div className="page-header">
          <h2>Campaigns</h2>
          <p className="subheading">Access campaign details</p>
        </div>
        <button
          className="campaigns-page__new-btn"
          onClick={() => navigate("/orders/new")}
        >
          + New campaign
        </button>
      </div>

      <div className="campaigns-page__table-card">
        <CampaignsTable campaigns={campaigns} loading={loading} />
      </div>

      {(hasMore || page > 1) && (
        <div className="campaigns-page__pagination">
          {page > 1 && (
            <button
              className="campaigns-page__prev-btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
          )}
          <button
            className="campaigns-page__next-btn"
            disabled={!hasMore}
            onClick={() => setPage((p) => p + 1)}
          >
            Next page
          </button>
        </div>
      )}
    </div>
  );
}
