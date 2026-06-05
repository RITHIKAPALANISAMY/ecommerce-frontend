import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function CheckoutSteps({ currentStep }) {
  const navigate = useNavigate();

  const steps = [
    { id: 1, label: "Address", path: "/checkout/address" },
    { id: 2, label: "Order Summary", path: "/checkout/summary" },
    { id: 3, label: "Payment", path: "/checkout/payment" },
  ];

  const handleStepClick = (step) => {
    if (step.id < currentStep) {
      navigate(step.path);
    }
  };

  return (
    <div className="w-full py-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md px-6 py-5">

        <div className="flex items-center justify-between relative">

          {/* Background Line */}
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 rounded-full" />

          {/* Animated Progress Line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.4 }}
            className="absolute top-4 left-0 h-1 bg-red-600 rounded-full"
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;
            const isClickable = step.id < currentStep;

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center z-10"
              >
                {/* Step Circle */}
                <motion.div
                  whileHover={isClickable ? { scale: 1.08 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  onClick={() => handleStepClick(step)}
                  className={`
                    flex items-center justify-center
                    w-9 h-9 rounded-full text-xs font-semibold
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isActive
                        ? "bg-red-600 text-white ring-2 ring-red-200"
                        : "bg-white border border-gray-300 text-gray-500"
                    }
                    ${isClickable ? "cursor-pointer" : "cursor-default"}
                  `}
                >
                  {isCompleted ? <Check size={14} /> : step.id}
                </motion.div>

                {/* Label */}
                <span
                  className={`
                    mt-2 text-xs font-medium transition-colors
                    ${
                      isActive
                        ? "text-red-600"
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}