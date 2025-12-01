import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WhitelistNew from './pages/WhitelistNew';
import WhitelistHistory from './pages/WhitelistHistory';
import WhitelistDetail from './pages/WhitelistDetail';
import AdminManagement from './pages/AdminManagement';
import Templates from './pages/Templates';
import Statistics from './pages/Statistics';
import Chat from './pages/Chat';
import Tickets from './pages/Tickets';
import Rules from './pages/Rules';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  const { token } = useAuthStore();

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/rules" element={<Rules />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="whitelist/new" element={<WhitelistNew />} />
        <Route path="whitelist/history" element={<WhitelistHistory />} />
        <Route path="whitelist/:id" element={<WhitelistDetail />} />
        <Route path="admins" element={<AdminManagement />} />
        <Route path="templates" element={<Templates />} />
        <Route path="statistics" element={<Statistics />} />
        <Route path="chat" element={<Chat />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
