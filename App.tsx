import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { UserAdminDashboard } from './components/UserAdminDashboard';
import { ClientDashboard } from './components/ClientDashboard';

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'superadmin' | 'useradmin' | 'client';
  name: string;
  email: string;
  createdBy?: string;
  createdAt: string;
  active: boolean;
  assignedClients?: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  contactPerson: string;
  phone: string;
  username: string;
  password: string;
  onboardedAt: string;
  active: boolean;
}

export interface Position {
  id: string;
  clientId: string;
  title: string;
  description: string;
  status: 'open' | 'closed';
  createdAt: string;
  createdBy: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  positionId: string;
  status: 'pending' | 'selected' | 'rejected' | 'on-hold';
  resume: string;
  uploadedBy: string;
  uploadedAt: string;
  interviewNotes?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  amount: number;
  description: string;
  projectName: string;
  generatedAt: string;
  status: 'pending' | 'paid';
  dueDate: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Initial mock data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      username: 'superadmin',
      password: 'admin123',
      role: 'superadmin',
      name: 'Super Admin',
      email: 'superadmin@ats.com',
      createdAt: new Date().toISOString(),
      active: true,
    },
    {
      id: '2',
      username: 'john.admin',
      password: 'admin123',
      role: 'useradmin',
      name: 'John Doe',
      email: 'john@ats.com',
      createdAt: new Date().toISOString(),
      active: true,
      assignedClients: ['1', '2'],
    },
  ]);

  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Tech Corp Inc',
      email: 'hr@techcorp.com',
      contactPerson: 'Sarah Johnson',
      phone: '+1-555-0101',
      username: 'techcorp',
      password: 'client123',
      onboardedAt: new Date().toISOString(),
      active: true,
    },
    {
      id: '2',
      name: 'Digital Solutions Ltd',
      email: 'contact@digitalsol.com',
      contactPerson: 'Mike Smith',
      phone: '+1-555-0102',
      username: 'digitalsol',
      password: 'client123',
      onboardedAt: new Date().toISOString(),
      active: true,
    },
  ]);

  const [positions, setPositions] = useState<Position[]>([
    {
      id: '1',
      clientId: '1',
      title: 'Senior Software Engineer',
      description: 'Looking for an experienced software engineer with 5+ years in React and Node.js',
      status: 'open',
      createdAt: new Date().toISOString(),
      createdBy: '1',
    },
    {
      id: '2',
      clientId: '1',
      title: 'Product Manager',
      description: 'Seeking a product manager with strong leadership skills',
      status: 'open',
      createdAt: new Date().toISOString(),
      createdBy: '1',
    },
    {
      id: '3',
      clientId: '2',
      title: 'UI/UX Designer',
      description: 'Creative designer needed with expertise in Figma and user research',
      status: 'closed',
      createdAt: new Date().toISOString(),
      createdBy: '2',
    },
  ]);

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: '1',
      name: 'Alice Williams',
      email: 'alice@example.com',
      phone: '+1-555-0201',
      positionId: '1',
      status: 'pending',
      resume: 'resume-alice.pdf',
      uploadedBy: '2',
      uploadedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Bob Anderson',
      email: 'bob@example.com',
      phone: '+1-555-0202',
      positionId: '1',
      status: 'selected',
      resume: 'resume-bob.pdf',
      uploadedBy: '2',
      uploadedAt: new Date().toISOString(),
      interviewNotes: 'Excellent technical skills',
    },
    {
      id: '3',
      name: 'Carol Martinez',
      email: 'carol@example.com',
      phone: '+1-555-0203',
      positionId: '2',
      status: 'rejected',
      resume: 'resume-carol.pdf',
      uploadedBy: '2',
      uploadedAt: new Date().toISOString(),
      interviewNotes: 'Not enough experience',
    },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: '1',
      clientId: '1',
      amount: 15000,
      description: 'Recruitment services for 3 positions',
      projectName: 'Q4 2024 Hiring',
      generatedAt: new Date().toISOString(),
      status: 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      clientId: '2',
      amount: 8000,
      description: 'UI/UX Designer placement',
      projectName: 'Designer Recruitment',
      generatedAt: new Date().toISOString(),
      status: 'paid',
      dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '2',
      receiverId: '1',
      message: 'Hi, I have some questions about the Senior Engineer position',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      senderId: '1',
      receiverId: '2',
      message: 'Sure, how can I help?',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ]);

  const handleLogin = (username: string, password: string, role: string) => {
    if (role === 'client') {
      const client = clients.find(
        (c) => c.username === username && c.password === password && c.active
      );
      if (client) {
        const clientUser: User = {
          id: client.id,
          username: client.username,
          password: client.password,
          role: 'client',
          name: client.name,
          email: client.email,
          createdAt: client.onboardedAt,
          active: client.active,
        };
        setCurrentUser(clientUser);
        return true;
      }
    } else {
      const user = users.find(
        (u) => u.username === username && u.password === password && u.role === role && u.active
      );
      if (user) {
        setCurrentUser(user);
        return true;
      }
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (currentUser.role === 'superadmin') {
    return (
      <SuperAdminDashboard
        currentUser={currentUser}
        users={users}
        setUsers={setUsers}
        clients={clients}
        setClients={setClients}
        positions={positions}
        candidates={candidates}
        invoices={invoices}
        setInvoices={setInvoices}
        onLogout={handleLogout}
      />
    );
  }

  if (currentUser.role === 'useradmin') {
    return (
      <UserAdminDashboard
        currentUser={currentUser}
        clients={clients}
        positions={positions}
        setPositions={setPositions}
        candidates={candidates}
        setCandidates={setCandidates}
        chatMessages={chatMessages}
        setChatMessages={setChatMessages}
        onLogout={handleLogout}
      />
    );
  }

  if (currentUser.role === 'client') {
    return (
      <ClientDashboard
        currentUser={currentUser}
        positions={positions}
        setPositions={setPositions}
        candidates={candidates}
        setCandidates={setCandidates}
        invoices={invoices}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}
