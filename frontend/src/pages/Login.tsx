import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      });

      if (response.data.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setTempToken(response.data.tempToken);
        toast.success('Veuillez entrer votre code 2FA');
      } else {
        setAuth(response.data.token, response.data.admin);
        toast.success('Connexion réussie !');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactor = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/verify-2fa', {
        tempToken,
        code: twoFactorCode,
      });

      setAuth(response.data.token, response.data.admin);
      toast.success('Connexion réussie !');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Code 2FA invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Revive RP</h1>
          <p className="text-gray-600 mt-2">Panel d'Administration Whitelist</p>
        </div>

        {!requiresTwoFactor ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTwoFactor} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code 2FA
              </label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Vérification...' : 'Vérifier'}
            </button>

            <button
              type="button"
              onClick={() => {
                setRequiresTwoFactor(false);
                setTwoFactorCode('');
                setTempToken('');
              }}
              className="w-full text-gray-600 hover:text-gray-800"
            >
              Retour
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
