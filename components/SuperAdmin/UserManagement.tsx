import { useState } from 'react';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { User } from '../../App';

interface UserManagementProps {
  users: User[];
  setUsers: (users: User[]) => void;
  currentUser: User;
}

export function UserManagement({ users, setUsers, currentUser }: UserManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
  });

  const userAdmins = users.filter((u) => u.role === 'useradmin');

  const handleAdd = () => {
    if (!formData.username || !formData.password || !formData.name || !formData.email) {
      alert('Please fill all fields');
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      ...formData,
      role: 'useradmin',
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
      active: true,
      assignedClients: [],
    };

    setUsers([...users, newUser]);
    setFormData({ username: '', password: '', name: '', email: '' });
    setShowAddForm(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.map((u) => (u.id === id ? { ...u, active: false } : u)));
    }
  };

  const handleReactivate = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, active: true } : u)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">User Admin Management</h2>
          <p className="text-gray-600">Create and manage user admin accounts</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Add User Admin
        </button>
      </div>

      {/* Add User Form */}
      {showAddForm && (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl border-2 border-purple-100 p-6 shadow-lg">
          <h3 className="text-gray-900 mb-4">Create New User Admin</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter password"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter email"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Save className="w-4 h-4" />
              Create User
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setFormData({ username: '', password: '', name: '', email: '' });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-md">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-purple-50 to-indigo-50">
            <tr>
              <th className="px-6 py-4 text-left text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-gray-700">Username</th>
              <th className="px-6 py-4 text-left text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-gray-700">Created</th>
              <th className="px-6 py-4 text-left text-gray-700">Status</th>
              <th className="px-6 py-4 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {userAdmins.map((user) => (
              <tr key={user.id} className={user.active ? 'hover:bg-purple-50 transition-colors' : 'bg-gray-50 opacity-60'}>
                <td className="px-6 py-4 text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-gray-700">{user.username}</td>
                <td className="px-6 py-4 text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full ${
                      user.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {user.active ? (
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Deactivate"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivate(user.id)}
                        className="px-3 py-1 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
                      >
                        Reactivate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {userAdmins.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No user admins found. Click "Add User Admin" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}