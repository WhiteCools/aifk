import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DiscordProvider } from './context/DiscordContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import DiscordAIHome from './pages/DiscordAIHome';
import DiscordAI from './pages/DiscordAI';
import QAManagement from './pages/QAManagement';
import ServerSetup from './pages/ServerSetup';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Protected Route wrapper component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

// Discord Callback Handler Component
function DiscordCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-12 h-12 border-4 border-[#5865F2] border-t-transparent rounded-full animate-spin"></div>
      <p className="ml-4 text-gray-600 dark:text-gray-300">Connecting to Discord...</p>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/discord/callback" element={<DiscordCallback />} />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        
        {/* Discord AI Routes */}
        <Route path="discord" element={<DiscordAIHome />} />
        <Route path="discord-ai" element={<DiscordAI />} />
        <Route path="qa-management" element={<QAManagement />} />
        <Route path="server-setup" element={<ServerSetup />} />
        
        {/* Other Routes */}
        <Route path="pricing" element={<Pricing />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <DiscordProvider>
            <AppRoutes />
          </DiscordProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
