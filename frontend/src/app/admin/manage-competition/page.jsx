'use client';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const Competitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [participationCount, setParticipationCount] = useState({});

  const fetchParticipationData = useCallback(async (compIds) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/part/getall`);
      const data = res.data;
      const counts = {};
      data.forEach(({ competition }) => {
        if (compIds.includes(competition)) {
          counts[competition] = (counts[competition] || 0) + 1;
        }
      });
      setParticipationCount(counts);
    } catch (error) {
      console.error('Error fetching participation data:', error);
    }
  }, []);

  const fetchCompData = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comp/getall/`);
      setCompetitions(res.data);
      fetchParticipationData(res.data.map(comp => comp._id));
    } catch (error) {
      console.error('Error fetching competitions:', error);
    }
  }, [fetchParticipationData]);

  useEffect(() => {
    fetchCompData();
  }, [fetchCompData]);

  const deleteCompetition = async (id) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/comp/delete/${id}`);
      toast.success('Competition deleted successfully');
      fetchCompData();
    } catch (error) {
      console.error('Error deleting competition:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="container h-screen mx-auto px-5 py-12">
      <section className="text-gray-700 body-font">
        <div className="divide-y divide-gray-200">
          {competitions.map((compet) => (
            <div key={compet._id} className="py-8 flex flex-wrap md:flex-nowrap items-center">
              <div className="w-full md:w-1/4 flex flex-col items-center">
                <div className="flex items-center justify-center bg-black text-white h-10 w-10 rounded-full shadow-md">
                  <Link href={`/admin/manage-participation/${compet._id}`}>
                    <span className="flex items-center gap-1 hover:scale-110 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047 9.005 9.005 0 0 1 5.9 8.181.75.75 0 1 1-1.499.044 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.5-.045 9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5ZM8 8a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
                      </svg>
                      {participationCount[compet._id] || 0}
                    </span>
                  </Link>
                </div>
                <span className="mt-2 text-gray-500 text-sm">
                  {format(new Date(compet.startdate), 'MMMM dd, yyyy')}
                </span>
              </div>

              <div className="md:flex-grow px-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{compet.title}</h2>
                <p className="text-gray-600">{compet.description}</p>
              </div>

              <div className="flex gap-4">
                <Link
                  href={`/admin/updatecomp/${compet._id}`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Update
                </Link>
                <button
                  onClick={() => deleteCompetition(compet._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Competitions;