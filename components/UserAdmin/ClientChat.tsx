import { useState } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { User, Client, ChatMessage } from '../../App';

interface ClientChatProps {
  currentUser: User;
  clients: Client[];
  chatMessages: ChatMessage[];
  setChatMessages: (messages: ChatMessage[]) => void;
}

export function ClientChat({
  currentUser,
  clients,
  chatMessages,
  setChatMessages,
}: ClientChatProps) {
  const [selectedClientId, setSelectedClientId] = useState<string>(clients[0]?.id || '');
  const [messageInput, setMessageInput] = useState('');

  // Filter messages for selected client
  const filteredMessages = chatMessages.filter(
    (msg) =>
      (msg.senderId === currentUser.id && msg.receiverId === selectedClientId) ||
      (msg.senderId === selectedClientId && msg.receiverId === currentUser.id)
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedClientId) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedClientId,
      message: messageInput,
      timestamp: new Date().toISOString(),
    };

    setChatMessages([...chatMessages, newMessage]);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Client Chat</h2>
        <p className="text-gray-600">Communicate with clients for better coordination</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Client List */}
        <div className="lg:col-span-1 bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-4">Clients</h3>
          <div className="space-y-2">
            {clients.map((client) => {
              const unreadCount = chatMessages.filter(
                (msg) => msg.senderId === client.id && msg.receiverId === currentUser.id
              ).length;

              return (
                <button
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedClientId === client.id
                      ? 'bg-indigo-100 text-indigo-900'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p>{client.name}</p>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500">{client.contactPerson}</p>
                </button>
              );
            })}
          </div>
          {clients.length === 0 && (
            <p className="text-gray-500 text-center py-4">No assigned clients</p>
          )}
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-gray-200 flex flex-col h-[600px]">
          {selectedClient ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-gray-900">{selectedClient.name}</h3>
                <p className="text-gray-600">{selectedClient.contactPerson}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <MessageSquare className="w-16 h-16 mb-4" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                )}
                {filteredMessages.map((msg) => {
                  const isSent = msg.senderId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2 rounded-lg ${
                          isSent
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p
                          className={`mt-1 ${
                            isSent ? 'text-indigo-200' : 'text-gray-500'
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
                    rows={2}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                <p>Select a client to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
