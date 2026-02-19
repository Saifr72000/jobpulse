import { useAuth } from '../context/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { MyOrdersList } from '../components/orders/MyOrdersList';

export function MyOrdersPage() {
  const { user } = useAuth();

  return (
    <>
      <DashboardHeader title="My orders" date={new Date()} user={user} />
      <MyOrdersList />
    </>
  );
}
