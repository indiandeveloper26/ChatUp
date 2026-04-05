'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function DownloadStats() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call your Node API to get count
    const fetchCount = async () => {
      try {
        const res = (await axios.post("http://localhost:4000/download/count")).data
       
        setCount(res.data.count);

        console.log(res)
      } catch (err) {
        console.error('Failed to fetch count:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-4xl font-bold mb-4">📥 Download Stats</h1>
      {loading ? (
        <p className="text-lg">Loading...</p>
      ) : (
        <div className="text-center">
          <p className="text-2xl font-semibold mb-2">Total Downloads:</p>
          <p className="text-6xl font-bold text-green-400">{count ?? 'N/A'}</p>
          <p className="mt-4 text-gray-400">Thank you for trusting our Private Calculator Chat App! 🚀</p>
        </div>
      )}
    </main>
  );
}
