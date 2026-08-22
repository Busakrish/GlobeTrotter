import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useAuth } from '../../context/AuthContext';

export function BudgetCategoryChart({ categories = [] }) {
  const { formatMoney } = useAuth();

  const filtered = categories.filter((c) => c.amount > 0);

  if (!filtered.length) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No expense data recorded yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700">
          <p className="font-bold">{data.name}</p>
          <p className="text-emerald-400 font-semibold">{formatMoney(data.amount)}</p>
          <p className="text-slate-400 text-[10px]">{data.percentage}% of total spent</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      <div className="h-56 w-56 relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={filtered}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="amount"
            >
              {filtered.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
          <span className="text-sm font-extrabold text-slate-800">
            {formatMoney(filtered.reduce((s, c) => s + c.amount, 0))}
          </span>
        </div>
      </div>

      {/* Legend / Breakdown List */}
      <div className="flex-1 w-full space-y-2.5">
        {filtered.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="font-medium text-slate-700">{cat.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900">{formatMoney(cat.amount)}</span>
              <span className="text-slate-400 text-[11px] w-8 text-right font-semibold">
                {cat.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BudgetCategoryChart;
