
import { useAuth } from '@/hooks/useAuth';
import withAuthLoading from '@/components/hoc/withAuthLoading';

const HomePage = () => {
  const { userData, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {userData?.username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default withAuthLoading(HomePage);
