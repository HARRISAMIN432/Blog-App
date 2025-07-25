import React, { useEffect, useState } from "react";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/subscribers", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      const data = await res.json();
      if (data.success) setSubscribers(data.subscribers);
    } catch (err) {
      console.error("Failed to fetch subscribers");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex justify-between items-center max-w-3xl">
        <h1>Subscribers</h1>
      </div>
      <div className="relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-700 text-left uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3 max-sm:hidden">
                Subscribed On
              </th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber, index) => (
              <tr key={subscriber._id} className="border-y border-gray-200">
                <td className="px-6 py-4 font-medium">{index + 1}</td>
                <td className="px-6 py-4">{subscriber.email}</td>
                <td className="px-6 py-4 max-sm:hidden">
                  {new Date(subscriber.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Subscribers;
