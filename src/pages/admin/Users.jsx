import { useMemo, useState, useEffect } from "react";
import { useUsers } from "../../context/UserContext";
import { toast } from "react-toastify";

const PAGE_SIZE = 8;

export default function AdminUsers() {
  const { users, blockUser, unblockUser, refreshUsers } = useUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [confirmUser, setConfirmUser] = useState(null);

  useEffect(() => {
    refreshUsers();
  }, []);

  /* ================= FILTER ================= */
  const filtered = useMemo(() => {
  return [...users]
    .filter((u) => {
      const matchesSearch =
        `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" || u.role === roleFilter;

      return matchesSearch && matchesRole;
    })
    .sort((a,b)=> new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

}, [users, search, roleFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const pagedUsers = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* ================= BLOCK / UNBLOCK ================= */
  const handleConfirmAction = async () => {
    if (!confirmUser) return;

    if (confirmUser.status === "active") {
      await blockUser(confirmUser.id);
      toast.success("User blocked successfully");
    } else {
      await unblockUser(confirmUser.id);
      toast.success("User unblocked successfully");
    }

    setConfirmUser(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Users Management
      </h2>

      {/* ================= FILTER BAR ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Roles</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left">Name</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {pagedUsers.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-6 py-4">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>

                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                    {u.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.status === "blocked"
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <button
                    onClick={() => setConfirmUser(u)}
                    className={`px-3 py-1 text-xs rounded text-white transition ${
                      u.status === "active"
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {u.status === "active"
                      ? "Block"
                      : "Unblock"}
                  </button>
                </td>
              </tr>
            ))}

            {pagedUsers.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="w-full flex justify-center mt-8">
        <div className="flex gap-2 flex-wrap">
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
      </div>

      {/* ================= CONFIRM MODAL ================= */}
      {confirmUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Action
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{" "}
              <strong>
                {confirmUser.status === "active"
                  ? "block"
                  : "unblock"}
              </strong>{" "}
              this user?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmUser(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAction}
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