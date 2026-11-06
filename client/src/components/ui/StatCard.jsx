import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  primary: {
    bg: 'bg-primary-100',
    text: 'text-primary-600',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
  },
  cyan: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-600',
  },
};

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = 'primary',
}) {
  const colors = colorMap[color] || colorMap.primary;

  return (
    <div className="card p-5 flex items-start gap-4">
      {/* Icon */}
      {Icon && (
        <div className={`${colors.bg} p-3 rounded-xl shrink-0`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>

        {trend !== undefined && trend !== null && (
          <div className="flex items-center gap-1 mt-1.5">
            {trendUp ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`text-xs font-semibold ${
                trendUp ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
