import { useAuth } from '@/hooks/useAuth';
import withAuthLoading from '@/components/hoc/withAuthLoading';

/**
 * The home page of the application, accessible after successful authentication.
 * Displays a welcome message with the username and a logout button.
 */
const HomePage = () => {
  const { userData, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {userData?.username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const AuthenticatedHomePage = withAuthLoading(HomePage);

export default AuthenticatedHomePage;
