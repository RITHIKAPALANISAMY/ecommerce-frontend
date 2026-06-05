export default function OrderTimeline({ status }) {

  const steps = [
    "PLACED",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED"
  ];

  return (
    <div className="flex justify-between mt-4 text-sm">
      {steps.map((step) => (
        <div
          key={step}
          className={
            status === step
              ? "text-green-600 font-semibold"
              : "text-gray-400"
          }
        >
          {step}
        </div>
      ))}
    </div>
  );
}