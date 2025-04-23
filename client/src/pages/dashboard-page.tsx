import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { ShipmentCost } from "@/components/dashboard/shipment-cost";
import { ChassisReport } from "@/components/dashboard/chassis-report";
import { StatCard } from "@/components/dashboard/stat-card";
import { AppLayout } from "@/components/layout/app-layout";

const statCards = [
  {
    title: "Vehicles",
    value: 34,
    icon: "car",
    gradient: "pink-to-rose",
  },
  {
    title: "Drivers",
    value: 21,
    icon: "users",
    gradient: "purple-to-indigo",
  },
  {
    title: "GTA",
    value: 130,
    icon: "truck",
    gradient: "blue-to-cyan",
  },
  {
    title: "Customers",
    value: 497,
    icon: "shopping-cart",
    gradient: "emerald-to-teal",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.username || "User"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon as any}
            gradient={card.gradient}
          />
        ))}
      </div>

      {/* Shipment Cost Chart */}
      <div className="mb-8 animate-fade-in">
        <ShipmentCost />
      </div>

      {/* Chassis Report */}
      <div className="mb-8 animate-fade-in">
        <ChassisReport />
      </div>
    </AppLayout>
  );
}
