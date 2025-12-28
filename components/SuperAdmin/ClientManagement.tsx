import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import { Client, User } from '../../App';

interface ClientManagementProps {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  users: User[];
  setUsers: (users: User[]) => void;
}

export function ClientManagement({ clients, setClients, users, setUsers }: ClientManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactPerson: '',
    phone: '',
    username: '',
    password: '',
  });

  const handleAdd = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.contactPerson ||
      !formData.username ||
      !formData.password
    ) {
      alert('Please fill all required fields');
      return;
    }

    const newClient: Client = {
      id: Date.now().toString(),
      ...formData,
      onboardedAt: new Date().toISOString(),
      active: true,
    };

    setClients([...clients, newClient]);
    setFormData({
      name: '',
      email: '',
      contactPerson: '',
      phone: '',
      username: '',
      password: '',
    });
    setShowAddForm(false);
  };

  const handleOffboard = (id: string) => {
    if (confirm('Are you sure you want to offboard this client?')) {
      setClients(clients.map((c) => (c.id === id ? { ...c, active: false } : c)));
    }
  };

  const handleReactivate = (id: string) => {
    setClients(clients.map((c) => (c.id === id ? { ...c, active: true } : c)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Client Management</h2>
          <p className="text-gray-600">Onboard and manage client accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Onboard Client
        </button>
      </div>

      {/* Add Client Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Onboard New Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Contact Person *</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter contact person"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter username for login"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter password"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Onboard Client
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setFormData({
                  name: '',
                  email: '',
                  contactPerson: '',
                  phone: '',
                  username: '',
                  password: '',
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

      {/* Clients Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Company</th>
              <th className="px-6 py-3 text-left text-gray-700">Contact Person</th>
              <th className="px-6 py-3 text-left text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-gray-700">Username</th>
              <th className="px-6 py-3 text-left text-gray-700">Onboarded</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className={client.active ? '' : 'bg-gray-50 opacity-60'}>
                <td className="px-6 py-4 text-gray-900">{client.name}</td>
                <td className="px-6 py-4 text-gray-700">{client.contactPerson}</td>
                <td className="px-6 py-4 text-gray-700">{client.email}</td>
                <td className="px-6 py-4 text-gray-700">{client.phone || 'N/A'}</td>
                <td className="px-6 py-4 text-gray-700">{client.username}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(client.onboardedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      client.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {client.active ? 'Active' : 'Offboarded'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {client.active ? (
                      <button
                        onClick={() => handleOffboard(client.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Offboard"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(client.id)}
                        className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No clients found. Click "Onboard Client" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
