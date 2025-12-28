import { useState } from 'react';
import { Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { Position, Client } from '../../App';

interface PositionManagementProps {
  positions: Position[];
  clients: Client[];
  setPositions: (positions: Position[]) => void;
}

export function PositionManagement({ positions, clients, setPositions }: PositionManagementProps) {
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  const filteredPositions = positions.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const getClientName = (clientId: string) => {
    return clients.find((c) => c.id === clientId)?.name || 'Unknown Client';
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1613759612065-d5971d32ca49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzY2ODcyODgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Office workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-cyan-900/80 flex items-center">
          <div className="max-w-7xl mx-auto px-6 text-white">
            <h1 className="text-white mb-2">Job Positions</h1>
            <p className="text-white/90">Manage open and closed positions from your assigned clients</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Position Management</h2>
          <p className="text-gray-600">View and manage client job positions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            All ({positions.length})
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              filter === 'open'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            Open ({positions.filter((p) => p.status === 'open').length})
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              filter === 'closed'
                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200'
            }`}
          >
            Closed ({positions.filter((p) => p.status === 'closed').length})
          </button>
        </div>
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPositions.map((position) => (
          <div
            key={position.id}
            className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
            onClick={() => setSelectedPosition(position)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${position.status === 'open' ? 'bg-gradient-to-br from-green-100 to-emerald-100' : 'bg-gradient-to-br from-red-100 to-pink-100'}`}>
                  <Briefcase className={`w-6 h-6 ${position.status === 'open' ? 'text-green-600' : 'text-red-600'}`} />
                </div>
                <div>
                  <h3 className="text-gray-900">{position.title}</h3>
                  <p className="text-gray-600">{getClientName(position.clientId)}</p>
                </div>
              </div>
              <div>
                {position.status === 'open' ? (
                  <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border-2 border-green-200">
                    <CheckCircle className="w-4 h-4" />
                    Open
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 rounded-full border-2 border-red-200">
                    <XCircle className="w-4 h-4" />
                    Closed
                  </span>
                )}
              </div>
            </div>
            <p className="text-gray-700 line-clamp-3">{position.description}</p>
            <p className="text-gray-500 mt-4">
              Created: {new Date(position.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {filteredPositions.length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-gray-200 p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No positions found</p>
        </div>
      )}

      {/* Position Detail Modal */}
      {selectedPosition && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setSelectedPosition(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-gray-900 mb-2">{selectedPosition.title}</h2>
                <p className="text-gray-600">{getClientName(selectedPosition.clientId)}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full ${
                  selectedPosition.status === 'open'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {selectedPosition.status}
              </span>
            </div>
            <div className="mb-4">
              <h3 className="text-gray-900 mb-2">Job Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{selectedPosition.description}</p>
            </div>
            <p className="text-gray-500 mb-6">
              Created: {new Date(selectedPosition.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => setSelectedPosition(null)}
              className="w-full px-4 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}