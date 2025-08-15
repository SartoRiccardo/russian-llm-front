import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router';
import { useToast } from '@/hooks/useToast';

/**
 * The login page component.
 * Allows users to log in with test credentials and handles authentication state.
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { createToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      createToast({
        type: 'ERROR',
        title: 'Authentication Error',
        content: 'Invalid email or password',
        dataCy: 'wrong-credentials'
      });
    }
  };

  if (isLoading) {
    return <div>Authenticating...</div>;
  }

  return (
    <div>
      <h1>Login</h1>
      <p>Use email: <strong>test@test.com</strong> and password: <strong>password</strong></p>
      <form onSubmit={handleSubmit} data-cy="f-login">
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <a href="#" data-cy="forgot-password">
        Forgot password?
      </a>
    </div>
  );
};

export default LoginPage;
