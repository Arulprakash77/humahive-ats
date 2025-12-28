import { useState } from 'react';
import { Plus, Save, X, Briefcase, Edit, Trash2 } from 'lucide-react';
import { Position } from '../../App';

interface ClientPositionsProps {
  positions: Position[];
  setPositions: (positions: Position[]) => void;
  clientId: string;
}

export function ClientPositions({ positions, setPositions, clientId }: ClientPositionsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const handleAdd = () => {
    if (!formData.title || !formData.description) {
      alert('Please fill all fields');
      return;
    }

    const newPosition: Position = {
      id: Date.now().toString(),
      clientId,
      title: formData.title,
      description: formData.description,
      status: 'open',
      createdAt: new Date().toISOString(),
      createdBy: clientId,
    };

    setPositions([...positions, newPosition]);
    setFormData({ title: '', description: '' });
    setShowAddForm(false);
  };

  const handleEdit = (position: Position) => {
    setEditingId(position.id);
    setFormData({
      title: position.title,
      description: position.description,
    });
  };

  const handleUpdate = () => {
    if (!editingId) return;

    setPositions(
      positions.map((p) =>
        p.id === editingId
          ? { ...p, title: formData.title, description: formData.description }
          : p
      )
    );
    setEditingId(null);
    setFormData({ title: '', description: '' });
  };

  const handleStatusToggle = (id: string) => {
    setPositions(
      positions.map((p) =>
        p.id === id ? { ...p, status: p.status === 'open' ? 'closed' : 'open' } : p
      )
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this position?')) {
      setPositions(positions.filter((p) => p.id !== id));
    }
  };

  const openPositions = positions.filter((p) => p.status === 'open');
  const closedPositions = positions.filter((p) => p.status === 'closed');

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1758518730380-04c8e0d57b68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBpbnRlcnZpZXclMjBoaXJpbmd8ZW58MXx8fHwxNzY2OTA4NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Hiring"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-emerald-900/80 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <h1 className="text-white mb-2">Your Job Openings</h1>
            <p className="text-white/90">Create and manage your recruitment positions</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Job Positions</h2>
          <p className="text-gray-600">Create and manage your job openings</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Create Position
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100 p-6">
          <p className="text-blue-700 mb-1">Total Positions</p>
          <p className="text-blue-900">{positions.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100 p-6">
          <p className="text-green-700 mb-1">Open Positions</p>
          <p className="text-green-900">{openPositions.length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border-2 border-red-100 p-6">
          <p className="text-red-700 mb-1">Closed Positions</p>
          <p className="text-red-900">{closedPositions.length}</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingId) && (
        <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl border-2 border-green-100 p-6 shadow-lg">
          <h3 className="text-gray-900 mb-4">
            {editingId ? 'Edit Position' : 'Create New Position'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Job Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-colors"
                placeholder="Describe the position, requirements, responsibilities..."
                rows={6}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <Save className="w-4 h-4" />
              {editingId ? 'Update' : 'Create'} Position
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                setFormData({ title: '', description: '' });
              }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Positions List */}
      <div className="space-y-4">
        {/* Open Positions */}
        <div>
          <h3 className="text-gray-900 mb-3">Open Positions ({openPositions.length})</h3>
          <div className="space-y-3">
            {openPositions.map((position) => (
              <div
                key={position.id}
                className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                      <Briefcase className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-gray-900">{position.title}</h4>
                      <p className="text-gray-500">
                        Created: {new Date(position.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(position)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusToggle(position.id)}
                      className="px-3 py-1 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleDelete(position.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{position.description}</p>
              </div>
            ))}
            {openPositions.length === 0 && (
              <div className="bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl border-2 border-gray-200 p-8 text-center text-gray-500">
                No open positions. Click "Create Position" to add one.
              </div>
            )}
          </div>
        </div>

        {/* Closed Positions */}
        {closedPositions.length > 0 && (
          <div>
            <h3 className="text-gray-900 mb-3">Closed Positions ({closedPositions.length})</h3>
            <div className="space-y-3">
              {closedPositions.map((position) => (
                <div
                  key={position.id}
                  className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-6 opacity-75 hover:opacity-100 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="bg-gradient-to-br from-red-100 to-pink-100 p-3 rounded-xl">
                        <Briefcase className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-gray-900">{position.title}</h4>
                        <p className="text-gray-500">
                          Created: {new Date(position.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusToggle(position.id)}
                        className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
                      >
                        Reopen
                      </button>
                      <button
                        onClick={() => handleDelete(position.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{position.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}