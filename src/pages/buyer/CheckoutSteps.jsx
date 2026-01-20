import { useNavigate } from "react-router-dom";
import "../../styles/checkoutSteps.css";

export default function CheckoutSteps({ currentStep }) {
  const navigate = useNavigate();

  const goTo = step => {
    if (step < currentStep) {
      if (step === 1) navigate("/checkout/address");
      if (step === 2) navigate("/checkout/summary");
    }
  };

  return (
    <div className="checkout-steps-wrapper">
      <div className="checkout-steps">

        {/* STEP 1 */}
        <div className="step-block" onClick={() => goTo(1)}>
          <div className={`step-circle ${currentStep >= 1 ? "active" : ""}`}>
            {currentStep > 1 ? "✓" : "1"}
          </div>
          <span className="step-label">Address</span>
        </div>

        <div className={`step-line ${currentStep >= 2 ? "active" : ""}`} />

        {/* STEP 2 */}
        <div className="step-block" onClick={() => goTo(2)}>
          <div className={`step-circle ${currentStep >= 2 ? "active" : ""}`}>
            {currentStep > 2 ? "✓" : "2"}
          </div>
          <span className="step-label">Order Summary</span>
        </div>

        <div className={`step-line ${currentStep >= 3 ? "active" : ""}`} />

        {/* STEP 3 */}
        <div className="step-block">
          <div className={`step-circle ${currentStep === 3 ? "active" : ""}`}>
            3
          </div>
          <span className="step-label">Payment</span>
        </div>

      </div>
    </div>
  );
}
