import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CheckoutSteps({ currentStep }) {
  const navigate = useNavigate();

  const steps = [
    { id: 1, label: "Address", path: "/checkout/address" },
    { id: 2, label: "Order Summary", path: "/checkout/summary" },
    { id: 3, label: "Payment", path: "/checkout/payment" },
  ];

  const handleStepClick = (step) => {
    // Only allow navigating to previous steps
    if (step.id < currentStep) {
      navigate(step.path);
    }
  };

  return (
    <div className="w-full bg-white py-6 shadow-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between">

        {steps.map((step, index) => {
          const isActive = currentStep >= step.id;
          const isClickable = step.id < currentStep;

          return (
            <div key={step.id} className="flex items-center w-full">

              {/* Step Circle */}
              <div className="flex flex-col items-center w-full relative">

                <motion.div
                  whileHover={isClickable ? { scale: 1.1 } : {}}
                  whileTap={isClickable ? { scale: 0.95 } : {}}
                  onClick={() => handleStepClick(step)}
                  className={`
                    flex h-10 w-10 items-center justify-center 
                    rounded-full border text-sm font-semibold
                    transition-all duration-300
                    ${
                      isActive
                        ? "bg-red-600 border-red-600 text-white"
                        : "bg-white border-gray-300 text-gray-500"
                    }
                    ${isClickable ? "cursor-pointer" : "cursor-default"}
                  `}
                >
                  {currentStep > step.id ? "✓" : step.id}
                </motion.div>

                <span className="mt-2 text-xs font-medium text-gray-700 text-center">
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                    h-1 flex-1 mx-2 rounded transition-all duration-300
                    ${
                      currentStep > step.id
                        ? "bg-red-600"
                        : "bg-gray-300"
                    }
                  `}
                />
              )}
            </div>
          );
        })}

      </div>
    </div>
  );
}