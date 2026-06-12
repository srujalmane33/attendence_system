import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../redux/userManagementSlice';
import NavBar from '../../component/navBar';
import AdminSideBar from '../../component/adminSideBar';

export default function UserManagement() {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.userManagement);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-slate-50">
      <NavBar />
      <AdminSideBar />
      <main className="pl-72 pt-24 pr-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Staff Roster Directory</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-sm font-semibold">
                  <th className="p-4">User Index Identifier</th>
                  <th className="p-4">Network Email Mapping</th>
                  <th className="p-4">Assigned Authority Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                {loading ? (
                  <tr><td colSpan="3" className="p-4 text-center text-slate-400">Loading directory index...</td></tr>
                ) : (
                  users.map((emp) => (
                    <tr key={emp._id || emp.id} className="hover:bg-slate-50">
                      <td className="p-4 font-medium">{emp.name}</td>
                      <td className="p-4 text-slate-500">{emp.email}</td>
                      <td className="p-4 uppercase text-xs tracking-wider font-semibold">{emp.role}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}