import { useUsers } from "../../context/UserContext";

const roleBadge = (role) =>
  role === "seller"
    ? "bg-blue-100 text-blue-700"
    : "bg-indigo-100 text-indigo-700";

const statusBadge = (status) =>
  status === "blocked"
    ? "bg-red-100 text-red-700"
    : "bg-green-100 text-green-700";

const AdminUsers = () => {
  const { users, blockUser, unblockUser } = useUsers();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">
        Users Management
      </h2>

      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-500"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="px-6 py-4 font-medium">
                    {u.name}
                  </td>

                  <td className="px-6 py-4">
                    {u.email}
                  </td>

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

                  <td className="px-6 py-4 space-x-4">
                    {u.status === "active" ? (
                      <button
                        onClick={() => blockUser(u.id)}
                        className="text-red-600 hover:underline font-medium"
                      >
                        Block
                      </button>
                    ) : (
                      <button
                        onClick={() => unblockUser(u.id)}
                        className="text-green-600 hover:underline font-medium"
                      >
                        Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;