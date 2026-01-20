const StatCard = ({ icon: Icon, value, label, color }) => {
  return (
    <div className="stat-card">
      <div className={`icon ${color}`}>
        <Icon />
      </div>
      <div>
        <h2>{value}</h2>
        <p>{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
