import { DollarSign, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function BudgetSummaryCards({ budgetSummary, onEditBudget }) {
  const { formatMoney } = useAuth();
  if (!budgetSummary) return null;

  const { totalBudget, totalSpent, remainingBalance, percentageUsed, status } = budgetSummary;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Total Budget Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Budget
          </span>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-slate-900">{formatMoney(totalBudget)}</p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">Allocated target</span>
          {onEditBudget && (
            <button
              type="button"
              onClick={onEditBudget}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
            >
              Edit Budget
            </button>
          )}
        </div>
      </div>

      {/* Estimated Spent Card */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Estimated Spent
          </span>
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-extrabold text-slate-900">{formatMoney(totalSpent)}</p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">Utilization</span>
          <span className="text-xs font-bold text-sky-600">{percentageUsed}% used</span>
        </div>
      </div>

      {/* Remaining Balance Card */}
      <div
        className={`p-5 rounded-2xl border shadow-xs text-left ${
          status === 'over'
            ? 'bg-rose-50/50 border-rose-200'
            : 'bg-white border-slate-200/90'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Remaining Balance
          </span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              status === 'over'
                ? 'bg-rose-100 text-rose-600'
                : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
        <p
          className={`text-2xl font-extrabold ${
            status === 'over' ? 'text-rose-600' : 'text-emerald-600'
          }`}
        >
          {remainingBalance < 0 ? `-${formatMoney(Math.abs(remainingBalance))}` : formatMoney(remainingBalance)}
        </p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">Funds available</span>
          <span
            className={`text-xs font-bold ${
              status === 'over' ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {status === 'over' ? 'Deficit' : 'Surplus'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BudgetSummaryCards;
