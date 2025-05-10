'use client';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Button } from "@nextui-org/react";

const Participant = () => {
  const { id } = useParams(); // Destructure id from useParams
  const [participants, setParticipants] = useState([]);
  const [compData, setCompData] = useState(null);
  const [coins, setCoins] = useState('');
  const [message, setMessage] = useState('');

  const coin = async (userId) => {
    if (!userId || !coins || isNaN(coins)) {
      setMessage('Invalid user ID or coins input');
      toast.error('Invalid user ID or coins input');
      return;
    }
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/give-coins`, {
        userId,
        coins: parseInt(coins),
      });
      setMessage(response.data.message);
      toast.success('Coins successfully sent');
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred');
      toast.error(err.response?.data?.error || 'Failed to send coins');
    }
  };

  // Using useCallback to memoize these functions
  const fetchParticipantData = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/part/getbycompetition/${id}`);
      setParticipants(res.data);
    } catch (error) {
      console.error('Error fetching participant data:', error);
      toast.error('Failed to fetch participant data');
    }
  }, [id]);

  const fetchCompetition = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comp/getbyid/${id}`);
      setCompData(res.data);
    } catch (error) {
      console.error('Error fetching competition data:', error);
      toast.error('Failed to fetch competition data');
    }
  }, [id]);

  useEffect(() => {
    fetchParticipantData();
    fetchCompetition();
  }, [fetchParticipantData, fetchCompetition]); // Added the memoized functions as dependencies

  const declareWinner = async (participantId) => {
    try {
      const result = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/comp/update/${id}`, {
        winner: participantId,
      });
      setCompData(result.data);
      toast.success('Competition updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update competition');
    }
  };

  const deleteParticipant = async (participantId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/part/delete/${participantId}`);
      fetchParticipantData(); // Refresh data after deletion
      toast.success('Participant deleted successfully');
    } catch (err) {
      toast.error('Failed to delete participant');
    }
  };

  return (
    <div className="flex justify-center w-11/12">
      <section className="text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="-my-8 divide-y-2 divide-gray-100">
            {participants.map((participant, index) => (
              <div key={participant._id} className="py-8 flex flex-wrap md:flex-nowrap">
                <div className="md:w-64 mb-6 flex-shrink-0 flex flex-col">
                  <span className="font-semibold title-font text-gray-700"></span>
                  <span className="mt-1 text-gray-500 text-sm">{participant.user.name}</span>
                </div>
                <div className="md:flex-grow">
                  <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">{participant.user.name}</h2>
                  <p className="leading-relaxed">{participant.blog.title}</p>
                </div>
                <div className="relative rounded-full overflow-hidden bg-white shadow-xl w-72">
                  <input
                    value={coins}
                    onChange={(e) => setCoins(e.target.value)}
                    className="input bg-transparent outline-none border-none pl-6 pr-10 py-5 w-full font-sans text-lg font-semibold"
                    placeholder="Enter coins"
                    type="number"
                  />
                  <div className="absolute right-2 top-[0.4em]">
                    <button
                      onClick={() => coin(participant.user._id)}
                      type="button"
                      className="w-14 h-14 rounded-full bg-violet-500 group shadow-xl flex items-center justify-center"
                    >
                      <svg
                        className="relative z-10"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 64 64"
                        height={50}
                        width={50}
                      >
                        <path
                          fillOpacity="0.01"
                          fill="white"
                          d="M63.6689 29.0491L34.6198 63.6685L0.00043872 34.6194L29.0496 1.67708e-05L63.6689 29.0491Z"
                        />
                        <path
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="3.76603"
                          stroke="white"
                          d="M42.8496 18.7067L21.0628 44.6712"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                <Button
                  onClick={() => declareWinner(participant.user._id)}
                  color="primary"
                >
                  Winner
                </Button>
                <a
                  href={`/blog/${participant.blog._id}`}
                  className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 px-4 py-2 rounded-full"
                >
                  View Blog
                </a>
                <button
                  onClick={() => deleteParticipant(participant._id)}
                  className="group relative flex h-14 w-14 flex-col items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-xl"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Participant;