import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../Sidebar';

/**
 * App shell: sidebar (navbar) + main content. Wraps all authenticated pages
 * except login and register.
 */
export function AppLayout() {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#F1F4F8]">
      <Sidebar onLogout={logout} />
      <main className="flex flex-1 flex-col p-6 pl-8">
        <Outlet />
      </main>
    </div>
  );
}
