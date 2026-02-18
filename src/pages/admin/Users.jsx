import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import { useUsers } from "../../context/UserContext";

/* BADGES */
const roleBadge = (role) =>
  role === "seller"
    ? "bg-blue-100 text-blue-700"
    : "bg-indigo-100 text-indigo-700";

const statusBadge = (status) =>
  status === "blocked"
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";

const PAGE_SIZE = 5;

export default function AdminUsers() {
  const {
    users,
    blockUser,
    unblockUser,
    deleteUser,
    refreshUsers, // ✅ ADD
  } = useUsers();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  /* FILTER */
  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (
        search &&
        !`${u.name} ${u.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;

      if (role !== "all" && u.role !== role) return false;
      if (status !== "all" && u.status !== status) return false;

      return true;
    });
  }, [users, search, role, status]);

  /* PAGINATION */
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pagedUsers = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* EXPORT CSV */
  const exportUsersCSV = () => {
    const rows = [
      ["Name", "Email", "Role", "Status"],
      ...filtered.map((u) => [
        u.name,
        u.email,
        u.role,
        u.status,
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users-report.csv";
    a.click();
  };

  /* EXPORT PDF */
  const exportUsersPDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("USER REPORT", 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      14,
      y
    );
    y += 10;

    filtered.forEach((u, i) => {
      doc.text(
        `${i + 1}. ${u.name} | ${u.email} | ${u.role} | ${u.status}`,
        14,
        y
      );
      y += 6;

      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("users-report.pdf");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Users Management
      </h2>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Roles</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>

        <button
          onClick={exportUsersCSV}
          className="border px-4 py-2 rounded"
        >
          Export CSV
        </button>

        <button
          onClick={exportUsersPDF}
          className="bg-[#931012] text-white px-4 py-2 rounded"
        >
          Export PDF
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pagedUsers.map((u) => (
              <tr key={u.__uid} className="border-t">
                <td className="px-6 py-4">{u.name}</td>
                <td className="px-6 py-4">{u.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadge(
                      u.role
                    )}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge(
                      u.status
                    )}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-3 text-xs">
                  {u.status === "active" ? (
                    <button
                      onClick={() => {
                        blockUser(u.__uid);
                        refreshUsers(); // ✅ ADD
                      }}
                      className="text-red-600"
                    >
                      Block
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        unblockUser(u.__uid);
                        refreshUsers(); // ✅ ADD
                      }}
                      className="text-green-600"
                    >
                      Unblock
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm("Delete this user?")) {
                        deleteUser(u.__uid);
                        refreshUsers(); // ✅ ADD
                      }
                    }}
                    className="text-gray-500"
                  >
                    Delete
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

      {/* PAGINATION */}
      <div className="flex justify-end gap-2 mt-4">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? "bg-[#931012] text-white"
                : "border"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}