import { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const ADMIN_EMAIL = 'dieyna1801@gmail.com';
const ADMIN_PASSWORD = 'passer@1';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true');
      onLogin();
    } else {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h1>Administration</h1>
          <p>Connectez-vous pour gérer vos projets</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="admin-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <label>
            <span>Email</span>
            <div className="admin-input-wrapper">
              <Mail size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                required
              />
            </div>
          </label>

          <label>
            <span>Mot de passe</span>
            <div className="admin-input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </label>

          <button type="submit" className="admin-login-btn">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
