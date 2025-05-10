'use client';
import useAppContext from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Navbar } from '@/components/Nav';
import axios from 'axios';
import { FiBarChart2, FiHome, FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import AnimatedContent from '@/components/Animated-content';

const Layout = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAppContext();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyuser`, {
        headers: { 'x-auth-token': token },
      });
      setUserData(res.data);
      console.log(res.data);
    } catch (err) {
      setError('Failed to fetch role data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!loading && userData) {
      if (!userData.role || userData.role !== 'admin') {
        toast.error('Unauthorized Access');
        router.push('/'); // Redirect unauthorized users
      }
    }
  }, [loading, userData, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='flex '>
                  <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col gap-6">
                <h2 className="text-2xl font-bold">Admin Panel</h2>
                <nav className="flex flex-col gap-4">
                    <Link href="/admin" className={`flex items-center gap-2 p-2 rounded ${pathname === "/admin" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                        <FiHome /> Dashboard
                    </Link>
                    <Link href="/admin/manage-competition" className={`flex items-center gap-2 p-2 rounded ${pathname === "/admin/manage-competition" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-device-desktop-cog"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 16h-8a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v7" /><path d="M7 20h5" /><path d="M9 16v4" /><path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M19.001 15.5v1.5" /><path d="M19.001 21v1.5" /><path d="M22.032 17.25l-1.299 .75" /><path d="M17.27 20l-1.3 .75" /><path d="M15.97 17.25l1.3 .75" /><path d="M20.733 20l1.3 .75" /></svg>
Manage Competition
                    </Link>
                    <Link href="/admin/createcompetition" className={`flex items-center gap-2 p-2 rounded ${pathname === "/admin/createcompetition" ? "bg-gray-700" : "hover:bg-gray-700"}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" style={{fill: 'white', transform: '', msfilter: ''}}><path d="M21 4h-3V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v1H3a1 1 0 0 0-1 1v3c0 4.31 1.799 6.91 4.819 7.012A6.001 6.001 0 0 0 11 17.91V20H9v2h6v-2h-2v-2.09a6.01 6.01 0 0 0 4.181-2.898C20.201 14.91 22 12.31 22 8V5a1 1 0 0 0-1-1zM4 8V6h2v6.83C4.216 12.078 4 9.299 4 8zm8 8c-2.206 0-4-1.794-4-4V4h8v8c0 2.206-1.794 4-4 4zm6-3.17V6h2v2c0 1.299-.216 4.078-2 4.83z" /></svg>
                         Create Competition
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded text-red-400">
                        <FiLogOut /> Logout
                    </button>
                </nav>
            </aside>

            <AnimatedContent
  distance={150}
  direction="vertical"
  reverse={true}
  config={{ tension: 80, friction: 20 }}
  initialOpacity={0.2}
  animateOpacity
  scale={1.1}
  threshold={0.2}
>
      {children}
  </AnimatedContent>
    </div>
  );
};

export default Layout;