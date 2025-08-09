
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { username, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default HomePage;
