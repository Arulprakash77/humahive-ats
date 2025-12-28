import { User, Client, Position, Candidate, Invoice } from '../../App';
import { Users, Building2, Briefcase, UserCheck, DollarSign, TrendingUp } from 'lucide-react';

interface ReportsAnalyticsProps {
  users: User[];
  clients: Client[];
  positions: Position[];
  candidates: Candidate[];
  invoices: Invoice[];
}

export function ReportsAnalytics({
  users,
  clients,
  positions,
  candidates,
  invoices,
}: ReportsAnalyticsProps) {
  // Calculate statistics
  const activeUsers = users.filter((u) => u.role === 'useradmin' && u.active).length;
  const activeClients = clients.filter((c) => c.active).length;
  const openPositions = positions.filter((p) => p.status === 'open').length;
  const closedPositions = positions.filter((p) => p.status === 'closed').length;
  const selectedCandidates = candidates.filter((c) => c.status === 'selected').length;
  const pendingCandidates = candidates.filter((c) => c.status === 'pending').length;
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const paidRevenue = invoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = invoices
    .filter((inv) => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.amount, 0);

  // Client-wise statistics
  const clientStats = clients.map((client) => {
    const clientPositions = positions.filter((p) => p.clientId === client.id);
    const clientCandidates = candidates.filter((c) =>
      clientPositions.some((p) => p.id === c.positionId)
    );
    const clientInvoices = invoices.filter((i) => i.clientId === client.id);
    const clientRevenue = clientInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    return {
      client,
      positionsCount: clientPositions.length,
      openPositions: clientPositions.filter((p) => p.status === 'open').length,
      candidatesCount: clientCandidates.length,
      selectedCandidates: clientCandidates.filter((c) => c.status === 'selected').length,
      revenue: clientRevenue,
    };
  });

  const stats = [
    {
      label: 'Active User Admins',
      value: activeUsers,
      icon: Users,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      lightColor: 'from-blue-50 to-blue-100',
    },
    {
      label: 'Active Clients',
      value: activeClients,
      icon: Building2,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      lightColor: 'from-green-50 to-green-100',
    },
    {
      label: 'Open Positions',
      value: openPositions,
      icon: Briefcase,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      lightColor: 'from-yellow-50 to-yellow-100',
    },
    {
      label: 'Selected Candidates',
      value: selectedCandidates,
      icon: UserCheck,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      lightColor: 'from-purple-50 to-purple-100',
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      lightColor: 'from-indigo-50 to-indigo-100',
    },
    {
      label: 'Paid Revenue',
      value: `$${paidRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      lightColor: 'from-emerald-50 to-emerald-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Reports & Analytics</h2>
        <p className="text-gray-600">Comprehensive overview of system performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.lightColor} rounded-2xl border border-gray-200 p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-xl shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md">
        <h3 className="text-gray-900 mb-4">Revenue Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200">
            <p className="text-indigo-700 mb-1">Total Revenue</p>
            <p className="text-indigo-900">${totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border-2 border-green-200">
            <p className="text-green-700 mb-1">Paid</p>
            <p className="text-green-900">${paidRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 border-2 border-yellow-200">
            <p className="text-yellow-700 mb-1">Pending</p>
            <p className="text-yellow-900">${pendingRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Candidate Status Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md">
        <h3 className="text-gray-900 mb-4">Candidate Status Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
            <p className="text-gray-900 mb-1">{pendingCandidates}</p>
            <p className="text-gray-600">Pending</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
            <p className="text-green-900 mb-1">{selectedCandidates}</p>
            <p className="text-green-700">Selected</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200">
            <p className="text-red-900 mb-1">
              {candidates.filter((c) => c.status === 'rejected').length}
            </p>
            <p className="text-red-700">Rejected</p>
          </div>
          <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
            <p className="text-yellow-900 mb-1">
              {candidates.filter((c) => c.status === 'on-hold').length}
            </p>
            <p className="text-yellow-700">On Hold</p>
          </div>
        </div>
      </div>

      {/* Client-wise Performance */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 className="text-gray-900">Client-wise Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Client</th>
                <th className="px-6 py-3 text-left text-gray-700">Total Positions</th>
                <th className="px-6 py-3 text-left text-gray-700">Open Positions</th>
                <th className="px-6 py-3 text-left text-gray-700">Total Candidates</th>
                <th className="px-6 py-3 text-left text-gray-700">Selected</th>
                <th className="px-6 py-3 text-left text-gray-700">Revenue</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {clientStats.map(({ client, positionsCount, openPositions, candidatesCount, selectedCandidates, revenue }) => (
                <tr key={client.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{client.name}</td>
                  <td className="px-6 py-4 text-gray-700">{positionsCount}</td>
                  <td className="px-6 py-4 text-gray-700">{openPositions}</td>
                  <td className="px-6 py-4 text-gray-700">{candidatesCount}</td>
                  <td className="px-6 py-4 text-gray-700">{selectedCandidates}</td>
                  <td className="px-6 py-4 text-gray-900">${revenue.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        client.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {client.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
              {clientStats.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No client data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}