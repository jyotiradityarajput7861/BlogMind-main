'use client';

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useAppContext from "@/context/AppContext";
import { FiHome, FiBarChart2, FiLogOut } from "react-icons/fi";
import Link from "next/link";
import AnimatedContent from '@/components/Animated-content';


const AdminPage = () => {
    return (
        <div className="flex h-screen bg-gray-100">
            <AnimatedContent
  distance={250}
  direction="vertical"
  reverse={false}
  config={{ tension: 80, friction: 20 }}
  initialOpacity={0.2}
  animateOpacity
  scale={1.1}
  threshold={0.2}
>

            
            {/* Main Content */}
            <main className="flex-1 p-6 flex flex-col gap-6 w-fit">
                {/* Top Bar */}
                <header className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Dashboard</h1>
                </header>

                {/* Charts Section */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <iframe
                        className="w-full h-64 bg-white border-none rounded-lg shadow-md"
                        src="https://charts.mongodb.com/charts-project-0-sthijxf/embed/charts?id=c156aae3-af17-4b6a-b133-95e6c9782a30&maxDataAge=3600&theme=light&autoRefresh=true">
                    </iframe>
                    <iframe
                        className="w-full h-64 bg-white border-none rounded-lg shadow-md"
                        src="https://charts.mongodb.com/charts-project-0-sthijxf/embed/charts?id=9e41d4fe-ee6a-40dc-82e3-982831f41473&maxDataAge=3600&theme=light&autoRefresh=true">
                    </iframe>
                    <iframe
                        className="w-full h-64 bg-white border-none rounded-lg shadow-md"
                        src="https://charts.mongodb.com/charts-project-0-sthijxf/embed/charts?id=03c8b3a0-f795-4a82-80c4-9d5227a992dd&maxDataAge=3600&theme=light&autoRefresh=true">
                    </iframe>
                    <iframe
                        className="w-full h-80 bg-white border-none rounded-lg shadow-md col-span-1 md:col-span-2 lg:col-span-3"
                        src="https://charts.mongodb.com/charts-project-0-sthijxf/embed/charts?id=e2fb24f4-1284-4a50-9287-25be31bbb25d&maxDataAge=3600&theme=light&autoRefresh=true">
                    </iframe>
                </section>
            </main>
                        </AnimatedContent>
        </div>
    );
};

export default AdminPage;