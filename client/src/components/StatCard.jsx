export default function StatCard({ label, value, icon: Icon, bgClass, textClass }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`w-10 h-10 ${bgClass} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${textClass}`} />
          </div>
        )}
        <div>
          <p className="text-2xl font-bold text-text font-mono">{value}</p>
          <p className="text-xs text-text-muted">{label}</p>
        </div>
      </div>
    </div>
  );
}
