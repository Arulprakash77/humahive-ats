import { useState } from 'react';
import { Plus, Upload, Mail, Save, X } from 'lucide-react';
import { Candidate, Position, Client, User } from '../../App';

interface CandidateManagementProps {
  positions: Position[];
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
  clients: Client[];
  currentUser: User;
}

export function CandidateManagement({
  positions,
  candidates,
  setCandidates,
  clients,
  currentUser,
}: CandidateManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPositionFilter, setSelectedPositionFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    positionId: '',
    resume: '',
  });

  const openPositions = positions.filter((p) => p.status === 'open');

  // Filter candidates by position
  const positionIds = positions.map((p) => p.id);
  const filteredCandidates = candidates.filter((c) => {
    if (!positionIds.includes(c.positionId)) return false;
    if (selectedPositionFilter === 'all') return true;
    return c.positionId === selectedPositionFilter;
  });

  const handleAdd = () => {
    if (!formData.name || !formData.email || !formData.positionId) {
      alert('Please fill all required fields');
      return;
    }

    const newCandidate: Candidate = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      uploadedBy: currentUser.id,
      uploadedAt: new Date().toISOString(),
    };

    setCandidates([...candidates, newCandidate]);
    setFormData({
      name: '',
      email: '',
      phone: '',
      positionId: '',
      resume: '',
    });
    setShowAddForm(false);
  };

  const handleStatusChange = (id: string, status: Candidate['status'], notes?: string) => {
    setCandidates(
      candidates.map((c) => (c.id === id ? { ...c, status, interviewNotes: notes || c.interviewNotes } : c))
    );

    // Simulate sending rejection email
    if (status === 'rejected') {
      const candidate = candidates.find((c) => c.id === id);
      if (candidate) {
        alert(
          `Auto-reply email sent to ${candidate.email}:\n\n` +
            `Dear ${candidate.name},\n\n` +
            `Thank you for your interest in our position. After careful consideration, ` +
            `we have decided to move forward with other candidates at this time.\n\n` +
            `We wish you the best in your job search.\n\n` +
            `Best regards,\nRecruitment Team`
        );
      }
    }
  };

  const getPositionTitle = (positionId: string) => {
    return positions.find((p) => p.id === positionId)?.title || 'Unknown Position';
  };

  const getClientName = (positionId: string) => {
    const position = positions.find((p) => p.id === positionId);
    if (!position) return 'Unknown';
    return clients.find((c) => c.id === position.clientId)?.name || 'Unknown';
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    selected: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    'on-hold': 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Candidate Management</h2>
          <p className="text-gray-600">Upload and manage candidate profiles</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Candidate
        </button>
      </div>

      {/* Filter by Position */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <label className="block text-gray-700 mb-2">Filter by Position</label>
        <select
          value={selectedPositionFilter}
          onChange={(e) => setSelectedPositionFilter(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
        >
          <option value="all">All Positions ({filteredCandidates.length})</option>
          {positions.map((position) => {
            const count = candidates.filter((c) => c.positionId === position.id).length;
            return (
              <option key={position.id} value={position.id}>
                {position.title} - {getClientName(position.id)} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* Add Candidate Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-gray-900 mb-4">Upload New Candidate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                placeholder="Enter candidate name"
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
              <label className="block text-gray-700 mb-2">Position *</label>
              <select
                value={formData.positionId}
                onChange={(e) => setFormData({ ...formData, positionId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select a position</option>
                {openPositions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.title} - {getClientName(position.id)}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Resume (filename)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.resume}
                  onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="e.g., resume-john-doe.pdf"
                />
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Browse
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Add Candidate
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  positionId: '',
                  resume: '',
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

      {/* Candidates Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Candidate</th>
              <th className="px-6 py-3 text-left text-gray-700">Position</th>
              <th className="px-6 py-3 text-left text-gray-700">Client</th>
              <th className="px-6 py-3 text-left text-gray-700">Contact</th>
              <th className="px-6 py-3 text-left text-gray-700">Resume</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-gray-900">{candidate.name}</p>
                    <p className="text-gray-500">
                      Uploaded: {new Date(candidate.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{getPositionTitle(candidate.positionId)}</td>
                <td className="px-6 py-4 text-gray-700">{getClientName(candidate.positionId)}</td>
                <td className="px-6 py-4">
                  <div className="text-gray-700">
                    <p>{candidate.email}</p>
                    <p className="text-gray-500">{candidate.phone}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-700">{candidate.resume || 'N/A'}</td>
                <td className="px-6 py-4">
                  <select
                    value={candidate.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as Candidate['status'];
                      if (newStatus === 'rejected') {
                        const notes = prompt('Enter rejection notes (optional):');
                        handleStatusChange(candidate.id, newStatus, notes || undefined);
                      } else {
                        handleStatusChange(candidate.id, newStatus);
                      }
                    }}
                    className={`px-2 py-1 rounded-full border-0 ${statusColors[candidate.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  {candidate.status === 'rejected' && (
                    <button
                      onClick={() =>
                        alert(`Resending rejection email to ${candidate.email}`)
                      }
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Resend Email"
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  )}
                  {candidate.interviewNotes && (
                    <button
                      onClick={() =>
                        alert(`Interview Notes:\n\n${candidate.interviewNotes}`)
                      }
                      className="ml-2 px-2 py-1 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    >
                      View Notes
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No candidates found. Click "Add Candidate" to upload one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
