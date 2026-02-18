import { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useOrders } from "../../context/OrderContext";
import { useWishlist } from "../../context/WishlistContext";
import EditProfileModal from "../../components/common/EditProfileModal";

export default function ProfilePage() {
  

  const { user, updateUser } = useAuth();
  const { cartItems } = useCart();
  const { orders } = useOrders();
 
  const { wishlist } = useWishlist();

  const [openEdit, setOpenEdit] = useState(false);

  if (!user) {
    return (
      <p className="p-10 text-center text-red-600">
        Please login to view profile
      </p>
    );
  }

  /* ================= HELPERS ================= */
  const normalizeStatus = (status = "") =>
    status.toLowerCase();

  /* ================= BUYER DATA ================= */
  const buyerOrders = useMemo(
  () =>
    orders.filter(
      (o) =>
        o.buyerEmail?.toLowerCase() ===
        user.email.toLowerCase()
    ),
  [orders, user.email]
);


  const buyerStatus = useMemo(
    () =>
      buyerOrders.reduce(
        (acc, o) => {
          const s = normalizeStatus(o.status);
          if (s === "placed") acc.placed++;
          if (s === "cancelled") acc.cancelled++;
          if (s === "delivered") acc.delivered++;
          return acc;
        },
        { placed: 0, cancelled: 0, delivered: 0 }
      ),
    [buyerOrders]
  );

  const totalSpent = useMemo(
    () =>
      buyerOrders
        .filter((o) => normalizeStatus(o.status) === "delivered")
        .reduce((sum, o) => sum + (o.amount?.total || 0), 0),
    [buyerOrders]
  );

  const cartCount = useMemo(
    () =>
      cartItems.reduce(
        (sum, i) => sum + i.quantity,
        0
      ),
    [cartItems]
  );

  /* ================= SELLER DATA ================= */
  const sellerItems = useMemo(
    () =>
      orders.flatMap((order) =>
        order.items
          .filter(
            (item) =>
              item.sellerId === user.email
          )
          .map((item) => ({
            ...item,
            orderStatus: order.status,
          }))
      ),
    [orders, user.email]
  );

  const sellerStats = useMemo(
    () =>
      sellerItems.reduce(
        (acc, item) => {
          acc.totalOrders++;
          acc.revenue +=
            item.price * item.quantity;

          const s = normalizeStatus(item.orderStatus);
          if (s === "placed") acc.active++;
          if (s === "cancelled") acc.cancelled++;
          if (s === "delivered") acc.delivered++;

          return acc;
        },
        {
          totalOrders: 0,
          active: 0,
          cancelled: 0,
          delivered: 0,
          revenue: 0,
        }
      ),
    [sellerItems]
  );

  const businessStatus =
    sellerStats.active > 0
      ? "Active"
      : sellerStats.delivered > 0
      ? "Completed"
      : "Idle";

  /* ================= ADMIN DATA ================= */
  const adminStats = useMemo(
    () =>
      orders.reduce(
        (acc, o) => {
          acc.total++;
          const s = normalizeStatus(o.status);
          if (s === "placed") acc.placed++;
          if (s === "cancelled") acc.cancelled++;
          if (s === "delivered") acc.delivered++;
          return acc;
        },
        {
          total: 0,
          placed: 0,
          cancelled: 0,
          delivered: 0,
        }
      ),
    [orders]
  );

  /* ================= PROFILE IMAGE ================= */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      updateUser({ profileImage: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSave = (data) => {
    updateUser(data);
    setOpenEdit(false);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-6 text-2xl font-semibold">
          My Profile
        </h2>

        {/* PROFILE CARD */}
        <div className="mb-6 flex flex-col gap-6 rounded-xl bg-white p-6 shadow sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={
                  user.profileImage ||
                  `https://ui-avatars.com/api/?name=${user.username}`
                }
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover border-2 border-red-200"
              />
              <label className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-red-600 p-1 text-xs text-white">
                ✎
                <input
                  type="file"
                  hidden
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {user.username}
              </h3>
              <p className="text-sm text-gray-500">
                {user.email}
              </p>
              <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium capitalize text-blue-700">
                {user.role}
              </span>
            </div>
          </div>

          <button
            onClick={() => setOpenEdit(true)}
            className="rounded bg-red-600 px-5 py-2 text-sm font-medium text-white"
          >
            Edit Profile
          </button>
        </div>

        {/* ACCOUNT */}
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <InfoCard title="Account Details">
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Role" value={user.role} />
            <InfoRow label="Status" value="Active" />
          </InfoCard>

          <InfoCard title="Contact">
            <InfoRow label="Phone" value={user.phone || "Not added"} />
            <InfoRow label="Address" value={user.address || "Not added"} />
          </InfoCard>
        </div>

        {/* BUYER */}
        {user.role === "buyer" && (
          <InfoCard title="Buyer Dashboard">
            <Dashboard>
              <Stat label="Placed" value={buyerStatus.placed} />
              <Stat label="Cancelled" value={buyerStatus.cancelled} />
              <Stat label="Delivered" value={buyerStatus.delivered} />
              <Stat label="Wishlist" value={wishlist.length} />
              <Stat label="Cart Items" value={cartCount} />
              <Stat label="Total Spent (₹)" value={totalSpent} />
            </Dashboard>
          </InfoCard>
        )}

        {/* SELLER */}
        {user.role === "seller" && (
          <InfoCard title="Seller Dashboard">
            <Dashboard>
              <Stat label="Total Orders" value={sellerStats.totalOrders} />
              <Stat label="Active" value={sellerStats.active} />
              <Stat label="Cancelled" value={sellerStats.cancelled} />
              <Stat label="Delivered" value={sellerStats.delivered} />
              <Stat label="Revenue (₹)" value={sellerStats.revenue} />
              <Stat label="Business Status" value={businessStatus} />
            </Dashboard>
          </InfoCard>
        )}

        {/* ADMIN */}
        {user.role === "admin" && (
          <InfoCard title="Admin Panel">
            <Dashboard>
              <Stat label="Total Orders" value={adminStats.total} />
              <Stat label="Placed" value={adminStats.placed} />
              <Stat label="Cancelled" value={adminStats.cancelled} />
              <Stat label="Delivered" value={adminStats.delivered} />
            </Dashboard>
          </InfoCard>
        )}

        {openEdit && (
          <EditProfileModal
            user={user}
            onClose={() => setOpenEdit(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}

/* ================= UI COMPONENTS ================= */

function InfoCard({ title, children }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h4 className="mb-4 text-lg font-semibold">
        {title}
      </h4>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="mb-3 flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <strong className="text-gray-800">{value}</strong>
    </div>
  );
}

function Dashboard({ children }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {children}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 text-center">
      <p className="text-2xl font-bold text-red-600">
        {value}
      </p>
      <span className="text-sm text-gray-500">
        {label}
      </span>
    </div>
  );
}
