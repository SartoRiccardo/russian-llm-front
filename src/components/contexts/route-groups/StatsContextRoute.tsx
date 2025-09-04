import { Outlet } from 'react-router';
import StatsProvider from '@/components/contexts/StatsProvider';

/**
 * Component that provides the stats context to all its children.
 * It will be used as a layout component for all routes that need access to the stats data.
 */
export default function StatsContextRoute() {
  return (
    <StatsProvider>
      <Outlet />
    </StatsProvider>
  );
}
