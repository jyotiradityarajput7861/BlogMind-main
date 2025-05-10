'use client'
import React, { useEffect, useState } from 'react';
import useAppContext from "@/context/AppContext.jsx";
import axios from 'axios';
import Image from 'next/image';

const Profile = () => {
  const { email } = useAppContext();
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!email) return;
        
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/getbyemail/${email}`);
        const data = res.data;
        console.log(data);
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, [email]);

  return (
    <div className='h-screen flex w-11/12 justify-center items-center'>
      {userData && (
        <div className="flex flex-col md:flex-row bg-white shadow-lg max-w-4xl rounded-lg overflow-hidden">
          {/* Image Section */}
          <div className="md:w-1/2 relative h-64 md:h-auto">
            <Image
              src={userData.avatar}
              alt={`${userData.name}'s profile picture`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {/* Text Section */}
          <div className="md:w-1/2 bg-gray-900 text-white p-8 flex flex-col justify-center">
            <div className="text-gray-500 mb-4">
              <span className="text-3xl">&ldquo;</span>
              <p className="text-lg leading-relaxed mb-6">
                {userData.description}
              </p>
            </div>

            <div>
              <p className="font-bold text-white text-lg">{userData.name}</p>
              <p className="text-gray-400">{userData.role}</p>
              <p className="text-gray-400">{userData.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;