import React from 'react';
import { useSelector } from 'react-redux';
import NavBar from '../../component/navBar';
import UserSideBar from '../../component/userSideBar';

export default function UserProfile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <UserSideBar />
      <main className="pl-72 pt-24 pr-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Profile Details</h2>
          <div className="space-y-4">
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Account Holder Name</span>
              <p className="text-slate-800 text-lg font-medium">{user?.name || 'N/A'}</p>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Registered Email Point</span>
              <p className="text-slate-800 text-lg font-medium">{user?.email || 'N/A'}</p>
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Assigned Identity Scope</span>
              <p className="text-slate-800 text-lg font-medium uppercase tracking-wide">{user?.role || 'N/A'}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}