import { useEffect, useMemo, useState } from "react";
import {
  getAllSellerRequests,
  approveSellerRequest,
  rejectSellerRequest,
} from "../../api/adminSellerApi";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

export default function AdminSellerRequests() {
  const [allRequests, setAllRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAllSellerRequests();

      const sorted = (res.data || []).sort(
        (a, b) =>
          new Date(b.requestedAt || 0) -
          new Date(a.requestedAt || 0)
      );

      setAllRequests(sorted);
    } catch {
      toast.error("Failed to load seller requests");
    }
  };

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
    return statusFilter === "ALL"
      ? allRequests
      : allRequests.filter(
          (r) =>
            String(r.status).toUpperCase() ===
            statusFilter
        );
  }, [allRequests, statusFilter]);

  /* ================= COUNTS ================= */
  const counts = {
    ALL: allRequests.length,
    PENDING: allRequests.filter(
      (r) => r.status === "PENDING"
    ).length,
    APPROVED: allRequests.filter(
      (r) => r.status === "APPROVED"
    ).length,
    REJECTED: allRequests.filter(
      (r) => r.status === "REJECTED"
    ).length,
  };

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= CONFIRM ACTION ================= */
  const handleConfirm = async () => {
    if (!confirmAction) return;

    setLoadingId(confirmAction.id);

    try {
      if (confirmAction.type === "approve") {
        await approveSellerRequest(confirmAction.id);
        toast.success("Seller approved successfully");
      } else {
        await rejectSellerRequest(confirmAction.id);
        toast.success("Seller rejected successfully");
      }

      fetchData();
    } catch {
      toast.error("Action failed");
    } finally {
      setLoadingId(null);
      setConfirmAction(null);
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Seller Requests
      </h2>

      {/* ================= FILTER TABS ================= */}
      <div className="grid grid-cols-2 md:flex gap-3 mb-6">
        {["ALL","PENDING","APPROVED","REJECTED"].map(tab => (
          <button
            key={tab}
            onClick={() => {
              setStatusFilter(tab);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === tab
                ? "bg-[#931012] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      {paginated.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
          No seller requests found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Store</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">GST</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(req => (
                <tr key={req.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{req.storeName}</td>
                  <td className="p-3">{req.phone}</td>
                  <td className="p-3">{req.gstNumber}</td>
                  <td className="p-3">{req.address}</td>
                  <td className="p-3">{req.user?.email}</td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    {req.status === "PENDING" && (
                      <>
                        <button
                          disabled={loadingId === req.id}
                          onClick={() =>
                            setConfirmAction({
                              id: req.id,
                              type: "approve"
                            })
                          }
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 disabled:opacity-50"
                        >
                          Approve
                        </button>

                        <button
                          disabled={loadingId === req.id}
                          onClick={() =>
                            setConfirmAction({
                              id: req.id,
                              type: "reject"
                            })
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-center mt-8 gap-2 flex-wrap">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-[#931012] text-white"
                : "border hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Action
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{" "}
              <strong>
                {confirmAction.type}
              </strong>{" "}
              this seller request?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-[#931012] text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}