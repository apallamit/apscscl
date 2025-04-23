import { cn } from "@/lib/utils";
import { 
  Car, Users, Truck, ShoppingCart, 
  Icon, LucideProps, Package
} from "lucide-react";
import { StatCard as StatCardType } from "@/types";
import { formatNumber } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: keyof typeof iconMap;
  gradient: string;
  className?: string;
}

const iconMap = {
  "car": Car,
  "users": Users,
  "truck": Truck,
  "shopping-cart": ShoppingCart,
  "package": Package
};

const gradientMap = {
  "pink-to-rose": "from-pink-500 to-rose-500",
  "purple-to-indigo": "from-purple-500 to-indigo-500",
  "blue-to-cyan": "from-blue-500 to-cyan-500",
  "emerald-to-teal": "from-emerald-500 to-teal-500"
};

export function StatCard({ title, value, icon, gradient, className }: StatCardProps) {
  const IconComponent = iconMap[icon] || Package;
  const gradientClass = gradientMap[gradient as keyof typeof gradientMap] || "from-gray-500 to-gray-700";
  
  return (
    <div className={cn(
      "card-stats rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 relative",
      "transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1",
      "bg-gradient-to-r", gradientClass, className
    )}>
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-white/10 rounded-md p-3">
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <div className="text-sm font-medium text-white truncate">{title}</div>
            <div className="text-3xl font-semibold text-white">{formatNumber(value)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
