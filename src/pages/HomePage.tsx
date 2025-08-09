
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { userData, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {userData?.username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default HomePage;
