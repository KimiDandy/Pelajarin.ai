'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiSettings, FiHelpCircle, FiLogOut } from 'react-icons/fi';
import { authUtils } from '@/lib/auth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Pengaturan Akun', href: '/dashboard/settings', icon: FiSettings },
  { name: 'Bantuan', href: '/dashboard/help', icon: FiHelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    authUtils.logout();
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold">Command Center</h2>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
        >
          <FiLogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
