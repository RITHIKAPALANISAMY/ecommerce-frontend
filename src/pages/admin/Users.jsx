const users = [
  { id: 1, name: "Arun", email: "arun@gmail.com", role: "Buyer", status: "Active" },
  { id: 2, name: "Priya", email: "priya@gmail.com", role: "Seller", status: "Blocked" },
];

const Users = () => {
  return (
    <div>
      <h2>Users Management</h2>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>
                <button className="btn">Block</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
