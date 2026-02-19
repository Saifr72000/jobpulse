import { Megaphone, Users, Coins } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { KpiCard } from '../components/dashboard/KpiCard';
import { ViewsChart } from '../components/dashboard/ViewsChart';
import { ChannelPerformanceCard } from '../components/dashboard/ChannelPerformanceCard';
import { CtaBanner } from '../components/dashboard/CtaBanner';

export function HomePage() {
  const { user } = useAuth();

  return (
    <>
      <DashboardHeader title="Dashboard" date={new Date()} user={user} />

      <section className="mb-6 grid grid-cols-3 gap-5">
        <KpiCard
          label="Active campaigns"
          value={3}
          icon={Megaphone}
          iconBgClassName="bg-[#D5E9FC]"
        />
        <KpiCard
          label="Applications received"
          value={25}
          icon={Users}
        />
        <KpiCard
          label="Spend"
          value="150 000 NOK"
          icon={Coins}
          iconBgClassName="bg-[#DDFF9D]"
        />
      </section>

      <section className="mb-6 flex gap-6">
        <ViewsChart />
        <ChannelPerformanceCard />
      </section>

      <CtaBanner
        title="Ready to launch a new campaign?"
        description="Create targeted job ads across multiple channels."
        buttonLabel="Create campaign"
      />
    </>
  );
}
