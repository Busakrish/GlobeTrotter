import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function SmartBudgetAlert({ budgetSummary }) {
  const { formatMoney } = useAuth();
  if (!budgetSummary) return null;

  const { status, remainingBalance, percentageUsed, totalBudget } = budgetSummary;

  if (status === 'over') {
    return (
      <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-left mb-6 animate-fade-in">
        <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800">
            Over Budget Alert
          </h4>
          <p className="text-sm font-bold text-rose-950 mt-0.5">
            {formatMoney(Math.abs(remainingBalance))} over planned budget ({percentageUsed}% spent).
          </p>
          <p className="text-xs text-rose-700 mt-0.5">
            Consider switching to budget accommodation or free walking activities.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'near') {
    return (
      <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-left mb-6 animate-fade-in">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Approaching Budget Limit
          </h4>
          <p className="text-sm font-bold text-amber-950 mt-0.5">
            You've utilized {percentageUsed}% of your budget. {formatMoney(remainingBalance)} remaining.
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Keep track of remaining activity expenses before booking new tours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-left mb-6 animate-fade-in">
      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
        <CheckCircle2 className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
          Healthy Travel Budget
        </h4>
        <p className="text-sm font-bold text-emerald-950 mt-0.5">
          {formatMoney(remainingBalance)} remaining ({percentageUsed}% used of {formatMoney(totalBudget)}).
        </p>
        <p className="text-xs text-emerald-700 mt-0.5">
          Looking great! Your spending is well within planned parameters.
        </p>
      </div>
    </div>
  );
}

export default SmartBudgetAlert;
