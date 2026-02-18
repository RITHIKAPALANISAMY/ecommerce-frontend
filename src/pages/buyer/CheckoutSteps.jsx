import { useNavigate } from "react-router-dom";

export default function CheckoutSteps({ currentStep }) {
  const navigate = useNavigate();

  const goTo = (step) => {
    if (step < currentStep) {
      if (step === 1) navigate("/checkout/address");
      if (step === 2) navigate("/checkout/summary");
    }
  };

  const circleBase =
    "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold cursor-pointer";
  const circleActive =
    "bg-red-600 border-red-600 text-white";
  const circleInactive =
    "bg-white border-gray-300 text-gray-500";

  const lineBase = "h-1 w-16 rounded";
  const lineActive = "bg-red-600";
  const lineInactive = "bg-gray-300";

  return (
    <div className="w-full bg-white py-4 shadow-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-center">

  
        <div
          className="flex cursor-pointer flex-col items-center"
          onClick={() => goTo(1)}
        >
          <div
            className={`${circleBase} ${
              currentStep >= 1 ? circleActive : circleInactive
            }`}
          >
            {currentStep > 1 ? "✓" : "1"}
          </div>
          <span className="mt-1 text-xs font-medium text-gray-700">
            Address
          </span>
        </div>

        <div
          className={`${lineBase} ${
            currentStep >= 2 ? lineActive : lineInactive
          }`}
        />

        <div
          className="flex cursor-pointer flex-col items-center"
          onClick={() => goTo(2)}
        >
          <div
            className={`${circleBase} ${
              currentStep >= 2 ? circleActive : circleInactive
            }`}
          >
            {currentStep > 2 ? "✓" : "2"}
          </div>
          <span className="mt-1 text-xs font-medium text-gray-700">
            Order Summary
          </span>
        </div>

      
        <div
          className={`${lineBase} ${
            currentStep >= 3 ? lineActive : lineInactive
          }`}
        />

    
        <div className="flex flex-col items-center">
          <div
            className={`${circleBase} ${
              currentStep === 3 ? circleActive : circleInactive
            } cursor-default`}
          >
            3
          </div>
          <span className="mt-1 text-xs font-medium text-gray-700">
            Payment
          </span>
        </div>

      </div>
    </div>
  );
}
