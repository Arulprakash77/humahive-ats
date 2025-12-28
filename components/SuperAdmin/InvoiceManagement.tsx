import { useState } from 'react';
import { Plus, Save, X, DollarSign, Download } from 'lucide-react';
import { Invoice, Client } from '../../App';

interface InvoiceManagementProps {
  invoices: Invoice[];
  setInvoices: (invoices: Invoice[]) => void;
  clients: Client[];
}

export function InvoiceManagement({ invoices, setInvoices, clients }: InvoiceManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    amount: '',
    description: '',
    projectName: '',
    dueDate: '',
  });

  const activeClients = clients.filter((c) => c.active);

  const handleAdd = () => {
    if (
      !formData.clientId ||
      !formData.amount ||
      !formData.description ||
      !formData.projectName ||
      !formData.dueDate
    ) {
      alert('Please fill all fields');
      return;
    }

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      clientId: formData.clientId,
      amount: parseFloat(formData.amount),
      description: formData.description,
      projectName: formData.projectName,
      generatedAt: new Date().toISOString(),
      status: 'pending',
      dueDate: new Date(formData.dueDate).toISOString(),
    };

    setInvoices([...invoices, newInvoice]);
    setFormData({
      clientId: '',
      amount: '',
      description: '',
      projectName: '',
      dueDate: '',
    });
    setShowAddForm(false);
  };

  const handleStatusChange = (id: string, status: 'pending' | 'paid') => {
    setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, status } : inv)));
  };

  const getClientName = (clientId: string) => {
    return clients.find((c) => c.id === clientId)?.name || 'Unknown Client';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Invoice Management</h2>
          <p className="text-gray-600">Generate and manage invoices for clients</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Generate Invoice
        </button>
      </div>

      {/* Add Invoice Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Generate New Invoice</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Client *</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select a client</option>
                {activeClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Project Name *</label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter project name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Amount ($) *</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter amount"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Due Date *</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter invoice description"
                rows={3}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Generate Invoice
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setFormData({
                  clientId: '',
                  amount: '',
                  description: '',
                  projectName: '',
                  dueDate: '',
                });
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Invoice ID</th>
              <th className="px-6 py-3 text-left text-gray-700">Client</th>
              <th className="px-6 py-3 text-left text-gray-700">Project</th>
              <th className="px-6 py-3 text-left text-gray-700">Amount</th>
              <th className="px-6 py-3 text-left text-gray-700">Generated</th>
              <th className="px-6 py-3 text-left text-gray-700">Due Date</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 text-gray-900">#{invoice.id.slice(-6)}</td>
                <td className="px-6 py-4 text-gray-900">{getClientName(invoice.clientId)}</td>
                <td className="px-6 py-4 text-gray-700">{invoice.projectName}</td>
                <td className="px-6 py-4 text-gray-900">
                  ${invoice.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(invoice.generatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={invoice.status}
                    onChange={(e) =>
                      handleStatusChange(invoice.id, e.target.value as 'pending' | 'paid')
                    }
                    className={`px-2 py-1 rounded-full border-0 ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => alert('Download invoice functionality')}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No invoices found. Click "Generate Invoice" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
