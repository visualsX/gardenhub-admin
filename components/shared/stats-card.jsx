// ============================================
// STATS CARD COMPONENT
// ============================================
export default function StatsCard({ title, value, variant = 'default', className = '' }) {
  const valueColors = {
    default: 'text-gray-900',
    danger: 'text-red-600',
    warning: 'text-orange-600',
    success: 'text-green-600',
  };

  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-5 ${className}`}>
      <div className="mb-2 text-sm text-gray-600">{title}</div>
      <div className={`text-3xl font-bold ${valueColors[variant]}`}>{value}</div>
    </div>
  );
}
