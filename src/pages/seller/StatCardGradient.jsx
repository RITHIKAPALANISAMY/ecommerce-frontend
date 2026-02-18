import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Package,
  IndianRupee,
  CheckCircle,
  XCircle,
} from "lucide-react";

const CONFIG = {
  orders: {
    gradient: "from-rose-500 to-red-500",
    icon: Package,
  },
  revenue: {
    gradient: "from-emerald-500 to-green-500",
    icon: IndianRupee,
  },
  delivered: {
    gradient: "from-sky-500 to-blue-500",
    icon: CheckCircle,
  },
  cancelled: {
    gradient: "from-slate-500 to-gray-500",
    icon: XCircle,
  },
};

export default function StatCardGradient({ title, value, type }) {
  const card = CONFIG[type] || CONFIG.orders;
  const Icon = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 0.25 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-md`}
    >
      <Icon className="absolute right-4 top-4 h-12 w-12 opacity-20" />

      <p className="text-sm uppercase tracking-wide opacity-90">
        {title}
      </p>

      <p className="mt-3 text-3xl font-bold">
        {typeof value === "number" ? (
          <CountUp end={value} duration={0.8} />
        ) : (
          value
        )}
      </p>
    </motion.div>
  );
}
