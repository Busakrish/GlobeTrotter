import { mockAdminStats } from '../data/mockAdmin';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Layers,
  DollarSign,
  AlertTriangle,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import Badge from '../components/common/Badge';

export function AdminDashboard() {
  const { kpis, userGrowthData, popularDestinations, categorySpendingDistribution, recentPlatformEvents } = mockAdminStats;

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            Platform Telemetry & Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            GlobeTrotter Admin Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time platform adoption, multi-city routing trends, conflict detection metrics, and financial flow.
          </p>
        </div>

        <Badge variant="indigo" className="px-3 py-1 font-bold text-xs">
          Hackathon Showcase Mode
        </Badge>
      </div>

      {/* 1. KPIs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {kpi.label}
              </span>
              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" /> {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{kpi.value}</p>
            <p className="text-[11px] text-slate-500 mt-1">Month-over-month growth</p>
          </div>
        ))}
      </div>

      {/* 2. Charts Row: Growth Area Chart + Category Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Growth Area Chart */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Traveler Signups & Itinerary Creation Growth
              </h3>
              <p className="text-xs text-slate-500">Monthly active volume progression</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Travelers
              </span>
              <span className="flex items-center gap-1.5 text-sky-500">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Trips Planned
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="travelersGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="tripsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip />
                <Area type="monotone" dataKey="travelers" stroke="#4f46e5" strokeWidth={2.5} fill="url(#travelersGrad)" />
                <Area type="monotone" dataKey="trips" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#tripsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Spending by Sector</h3>
            <p className="text-xs text-slate-500">Platform-wide expenditure breakdown</p>
          </div>

          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySpendingDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categorySpendingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {categorySpendingDistribution.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="font-medium text-slate-700">{cat.name}</span>
                </div>
                <span className="font-extrabold text-slate-900">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Popular Destinations Leaderboard & Real-Time Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Popular Destinations */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Trending Destination Corridors</h3>
            <p className="text-xs text-slate-500">Most frequent multi-city pairings</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Destination</th>
                  <th className="py-2.5 px-3">Trips Count</th>
                  <th className="py-2.5 px-3">Avg Stay</th>
                  <th className="py-2.5 px-3">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {popularDestinations.map((dest, idx) => (
                  <tr key={dest.name} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      {dest.name}
                    </td>
                    <td className="py-3 px-3">{dest.tripsCount.toLocaleString()}</td>
                    <td className="py-3 px-3">{dest.avgDays} Days</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${dest.percentage * 3}%` }}
                          />
                        </div>
                        <span className="font-bold">{dest.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Real-Time Platform Events Stream */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Activity Feed</h3>
            <p className="text-xs text-slate-500">Real-time traveler actions & planner events</p>
          </div>

          <div className="space-y-3">
            {recentPlatformEvents.map((ev) => (
              <div
                key={ev.id}
                className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 leading-snug">
                    <strong className="text-indigo-700">{ev.user}</strong> {ev.action}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{ev.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
