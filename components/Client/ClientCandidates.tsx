import { useState } from 'react';
import { Users, Filter } from 'lucide-react';
import { Position, Candidate } from '../../App';

interface ClientCandidatesProps {
  positions: Position[];
  candidates: Candidate[];
  setCandidates: (candidates: Candidate[]) => void;
}

export function ClientCandidates({ positions, candidates, setCandidates }: ClientCandidatesProps) {
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Get position IDs for this client
  const positionIds = positions.map((p) => p.id);

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    if (!positionIds.includes(c.positionId)) return false;
    if (filterPosition !== 'all' && c.positionId !== filterPosition) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  const handleStatusChange = (id: string, status: Candidate['status']) => {
    setCandidates(candidates.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const handleAddNotes = (id: string) => {
    const notes = prompt('Enter interview notes:');
    if (notes !== null) {
      setCandidates(
        candidates.map((c) => (c.id === id ? { ...c, interviewNotes: notes } : c))
      );
    }
  };

  const getPositionTitle = (positionId: string) => {
    return positions.find((p) => p.id === positionId)?.title || 'Unknown Position';
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    selected: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    'on-hold': 'bg-gray-100 text-gray-800',
  };

  // Statistics
  const stats = {
    total: filteredCandidates.length,
    pending: filteredCandidates.filter((c) => c.status === 'pending').length,
    selected: filteredCandidates.filter((c) => c.status === 'selected').length,
    rejected: filteredCandidates.filter((c) => c.status === 'rejected').length,
    onHold: filteredCandidates.filter((c) => c.status === 'on-hold').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Candidate Review</h2>
        <p className="text-gray-600">Review and manage candidate applications</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Total</p>
          <p className="text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <p className="text-yellow-700 mb-1">Pending</p>
          <p className="text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <p className="text-green-700 mb-1">Selected</p>
          <p className="text-green-900">{stats.selected}</p>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <p className="text-red-700 mb-1">Rejected</p>
          <p className="text-red-900">{stats.rejected}</p>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <p className="text-gray-700 mb-1">On Hold</p>
          <p className="text-gray-900">{stats.onHold}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-gray-900">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">Position</label>
            <select
              value={filterPosition}
              onChange={(e) => setFilterPosition(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Positions</option>
              {positions.map((position) => {
                const count = candidates.filter((c) => c.positionId === position.id).length;
                return (
                  <option key={position.id} value={position.id}>
                    {position.title} ({count})
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Candidate</th>
              <th className="px-6 py-3 text-left text-gray-700">Position</th>
              <th className="px-6 py-3 text-left text-gray-700">Contact</th>
              <th className="px-6 py-3 text-left text-gray-700">Resume</th>
              <th className="px-6 py-3 text-left text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <button
                    onClick={() => setSelectedCandidate(candidate)}
                    className="text-left hover:text-indigo-600"
                  >
                    <p className="text-gray-900">{candidate.name}</p>
                    <p className="text-gray-500">
                      Applied: {new Date(candidate.uploadedAt).toLocaleDateString()}
                    </p>
                  </button>
                </td>
                <td className="px-6 py-4 text-gray-700">{getPositionTitle(candidate.positionId)}</td>
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
                    onChange={(e) =>
                      handleStatusChange(candidate.id, e.target.value as Candidate['status'])
                    }
                    className={`px-2 py-1 rounded-full border-0 ${statusColors[candidate.status]}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleAddNotes(candidate.id)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {candidate.interviewNotes ? 'Edit Notes' : 'Add Notes'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredCandidates.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No candidates found</p>
                  <p className="text-gray-400">Candidates will appear here once the recruitment team uploads them</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCandidate(null)}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-gray-900 mb-6">Candidate Details</h2>

            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Name</p>
                <p className="text-gray-900">{selectedCandidate.name}</p>
              </div>

              <div>
                <p className="text-gray-600">Email</p>
                <p className="text-gray-900">{selectedCandidate.email}</p>
              </div>

              <div>
                <p className="text-gray-600">Phone</p>
                <p className="text-gray-900">{selectedCandidate.phone || 'N/A'}</p>
              </div>

              <div>
                <p className="text-gray-600">Position</p>
                <p className="text-gray-900">{getPositionTitle(selectedCandidate.positionId)}</p>
              </div>

              <div>
                <p className="text-gray-600">Resume</p>
                <p className="text-gray-900">{selectedCandidate.resume || 'N/A'}</p>
              </div>

              <div>
                <p className="text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full ${statusColors[selectedCandidate.status]}`}>
                  {selectedCandidate.status}
                </span>
              </div>

              <div>
                <p className="text-gray-600">Applied On</p>
                <p className="text-gray-900">
                  {new Date(selectedCandidate.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              {selectedCandidate.interviewNotes && (
                <div>
                  <p className="text-gray-600">Interview Notes</p>
                  <div className="bg-gray-50 rounded-lg p-4 mt-2">
                    <p className="text-gray-900 whitespace-pre-line">
                      {selectedCandidate.interviewNotes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedCandidate(null)}
              className="w-full mt-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
