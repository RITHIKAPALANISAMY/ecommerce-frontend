import { useEffect, useState } from "react";
import {
  getPendingSellerRequests,
  approveSellerRequest,
} from "../../api/adminSellerApi";

export default function AdminSellerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await getPendingSellerRequests();
      setRequests(response.data);
    } catch (err) {
      console.error("Failed to load requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveSellerRequest(id);
      alert("Seller approved successfully!");
      fetchRequests(); // refresh list
    } catch (err) {
      alert("Approval failed");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Pending Seller Requests
      </h2>

      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4">Store</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">GST</th>
                <th className="px-6 py-4">Address</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="px-6 py-4">{req.storeName}</td>
                  <td className="px-6 py-4">{req.phone}</td>
                  <td className="px-6 py-4">{req.gstNumber}</td>
                  <td className="px-6 py-4">{req.address}</td>
                  <td className="px-6 py-4">{req.user?.email}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
