import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import TripHeader from '../components/trip/TripHeader';
import BudgetSummaryCards from '../components/budget/BudgetSummaryCards';
import BudgetCategoryChart from '../components/budget/BudgetCategoryChart';
import DailySpendingChart from '../components/budget/DailySpendingChart';
import SmartBudgetAlert from '../components/budget/SmartBudgetAlert';
import Modal from '../components/common/Modal';
import Input, { Select } from '../components/common/Input';
import Button from '../components/common/Button';
import {
  Plus,
  Trash2,
  PieChart,
  BarChart3,
  Receipt,
} from 'lucide-react';

export function Budget() {
  const { tripId, id } = useParams();
  const {
    trips,
    activeTrip,
    getTripById,
    updateTrip,
    addExpense,
    deleteExpense,
    calculateTripBudgetSummary,
  } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess } = useNotification();

  const trip = getTripById(tripId || id) || activeTrip || trips[0];

  // Modals state
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [editBudgetModalOpen, setEditBudgetModalOpen] = useState(false);
  const [newBudgetVal, setNewBudgetVal] = useState(trip?.budget || 45000);

  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'Transport',
    amount: 1500,
    date: trip?.startDate || new Date().toISOString().split('T')[0],
  });

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-indigo-600 font-bold text-xs mt-2 inline-block">
          Return to My Trips
        </Link>
      </div>
    );
  }

  const budgetSummary = calculateTripBudgetSummary(trip);

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.description.trim() || !newExpense.amount) return;

    addExpense(trip.id, newExpense);
    setAddExpenseModalOpen(false);
    setNewExpense({
      description: '',
      category: 'Transport',
      amount: 1500,
      date: trip.startDate,
    });
    notifySuccess(`Added expense "${newExpense.description}" (${formatMoney(Number(newExpense.amount))})`);
  };

  const handleSaveBudget = (e) => {
    e.preventDefault();
    updateTrip(trip.id, { budget: Number(newBudgetVal) });
    setEditBudgetModalOpen(false);
    notifySuccess(`Updated total trip budget to ${formatMoney(Number(newBudgetVal))}`);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* 1. Trip Header */}
      <TripHeader trip={trip} activeTab="budget" />

      {/* 2. Budget Metric Cards */}
      <BudgetSummaryCards
        budgetSummary={budgetSummary}
        onEditBudget={() => {
          setNewBudgetVal(trip.budget);
          setEditBudgetModalOpen(true);
        }}
      />

      {/* 3. Smart Budget Alert */}
      <SmartBudgetAlert budgetSummary={budgetSummary} />

      {/* 4. Financial Charts Grid (Donut Category + Bar Daily) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Breakdown (Donut Chart) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-600" />
                Category Breakdown
              </h3>
              <p className="text-xs text-slate-500">Distribution across major expense types</p>
            </div>
          </div>
          <BudgetCategoryChart categories={budgetSummary.categories} />
        </div>

        {/* Daily Spending Chart (Bar Chart) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Daily Spending Comparison
              </h3>
              <p className="text-xs text-slate-500">Day-wise expenditure pattern</p>
            </div>
          </div>
          <DailySpendingChart dailySpending={budgetSummary.dailySpending} />
        </div>
      </div>

      {/* 5. Expense Transaction Ledger Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-600" />
              Expense Ledger & Activity Costs
            </h3>
            <p className="text-xs text-slate-500">
              Itemized bookings, stays, transit tickets, and daily activity fees
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            icon={Plus}
            onClick={() => setAddExpenseModalOpen(true)}
          >
            Add Custom Expense
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {trip.expenses?.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{exp.description}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-500">{exp.date}</td>
                  <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                    {formatMoney(exp.amount)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        deleteExpense(trip.id, exp.id);
                        notifySuccess('Expense removed.');
                      }}
                      className="p-1 text-slate-300 hover:text-rose-600 transition-colors"
                      title="Delete expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add Custom Expense */}
      <Modal
        isOpen={addExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        title="Add Expense"
        subtitle={`Log cost for ${trip.title}`}
      >
        <form onSubmit={handleAddExpenseSubmit} className="space-y-4 text-left">
          <Input
            label="Description"
            placeholder="e.g. Scuba package, Dinner at beach shack, Train ticket"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              options={[
                { value: 'Transport', label: 'Transport & Flights' },
                { value: 'Accommodation', label: 'Accommodation' },
                { value: 'Food & Dining', label: 'Food & Dining' },
                { value: 'Activities', label: 'Activities & Tours' },
                { value: 'Other', label: 'Other / Misc' },
              ]}
            />
            <Input
              label="Amount (₹)"
              type="number"
              min="1"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
              required
            />
          </div>

          <Input
            label="Expense Date"
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setAddExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={Plus}>
              Log Expense
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Edit Total Budget */}
      <Modal
        isOpen={editBudgetModalOpen}
        onClose={() => setEditBudgetModalOpen(false)}
        title="Edit Trip Total Budget"
        subtitle="Adjust your target spending cap"
      >
        <form onSubmit={handleSaveBudget} className="space-y-4 text-left">
          <Input
            label="Total Allocated Budget (₹)"
            type="number"
            min="5000"
            step="1000"
            value={newBudgetVal}
            onChange={(e) => setNewBudgetVal(Number(e.target.value))}
            required
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setEditBudgetModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Budget
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Budget;
