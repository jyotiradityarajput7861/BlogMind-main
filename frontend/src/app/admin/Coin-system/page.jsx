'use client'
import React, { useState } from 'react';
import axios from 'axios';

const GiveCoins = () => {
  const [userId, setUserId] = useState('');
  const [coins, setCoins] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/give-coins`, { userId, coins: parseInt(coins) });
      setMessage(response.data.message);
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div>
      <h1>Give Coins</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Number of Coins"
          value={coins}
          onChange={(e) => setCoins(e.target.value)}
          required
        />
        <button type="submit">Give Coins</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GiveCoins;