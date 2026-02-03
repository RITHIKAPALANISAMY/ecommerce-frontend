import { motion } from "framer-motion";
import {
  Package,
  IndianRupee,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function SoftStatCard({ title, value, type = "default" }) {
  const styles = {
    orders: {
      bg: "bg-red-50",
      text: "text-red-700",
      icon: Package,
    },
    revenue: {
      bg: "bg-green-50",
      text: "text-green-700",
      icon: IndianRupee,
    },
    delivered: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: CheckCircle,
    },
    cancelled: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: XCircle,
    },

    
    default: {
      bg: "bg-slate-50",
      text: "text-slate-700",
      icon: Package,
    },
  };

  const { bg, text, icon: Icon } = styles[type] || styles.default;

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
      className={`rounded-xl p-5 ${bg} shadow-sm hover:shadow-md`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow">
          <Icon className={`h-5 w-5 ${text}`} />
        </div>

        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`mt-1 text-2xl font-bold ${text}`}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
