import { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import MyOrders from "./pages/MyOrders";
import NewOrder from "./pages/NewOrder";
import OrderDetail from "./pages/OrderDetail";

export type Page = "dashboard" | "my-orders" | "new-order" | string;

function getInitialPage(): Page {
  const params = new URLSearchParams(window.location.search);
  const page = params.get("page");
  if (page === "my-orders") return "my-orders";
  if (page === "new-order") return "new-order";
  return "dashboard";
}

function App() {
  const [page, setPage] = useState<Page>(getInitialPage);

  const navigate = (p: Page) => setPage(p);

  if (page.startsWith("order-detail:")) {
    const orderId = page.slice("order-detail:".length);
    return <OrderDetail orderId={orderId} onNavigate={navigate} />;
  }

  switch (page) {
    case "my-orders":
      return <MyOrders onNavigate={navigate} />;
    case "new-order":
      return <NewOrder onNavigate={navigate} />;
    default:
      return <Dashboard onNavigate={navigate} />;
  }
}

export default App;
