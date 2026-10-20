import { Activity, LayoutDashboard, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'text-athena-light' : 'text-athena-gray hover:text-athena-white';

  return (
    <nav className="bg-athena-electric border-b border-athena-turquoise/30 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Activity className="text-athena-light w-6 h-6" />
          <span className="font-bold text-xl tracking-wider text-athena-white">ATHENA<span className="text-athena-light">NBA</span></span>
        </div>
        <div className="flex space-x-6">
          <Link to="/" className={"flex items-center space-x-2 transition-colors " + isActive('/')}>
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link to="/settings" className={"flex items-center space-x-2 transition-colors " + isActive('/settings')}>
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
