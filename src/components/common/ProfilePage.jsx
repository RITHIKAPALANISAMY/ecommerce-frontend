import { useState } from "react";
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

  
  const userOrders = orders.filter(
    (o) => o.buyerEmail === user.email
  );

  const stats = {
    orders: userOrders.length,
    wishlist: wishlist.length,
    cart: cartItems.reduce((sum, i) => sum + i.qty, 0),
    reviews: userOrders.reduce(
      (count, o) =>
        count +
        o.items.filter((i) => i.reviewed).length,
      0
    ),
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

        
        <div className="mb-6 flex flex-col gap-6 rounded-xl bg-white p-6 shadow sm:flex-row sm:items-center sm:justify-between transition hover:shadow-md">
          <div className="flex items-center gap-5">
            <img
  src={
    user.profileImage ||
    "https://ui-avatars.com/api/?name=User&background=fee2e2&color=dc2626"
  }
  alt="Profile"
  className="h-16 w-16 rounded-full object-cover border-2 border-red-200 shadow"
/>


            <div>
              <h3 className="text-lg font-semibold">
                {user.username}
              </h3>
              <p className="text-sm text-gray-500">
                {user.email}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-0.5 text-xs font-medium capitalize text-blue-700">
                  {user.role}
                </span>
                <span className="rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-700">
                  Verified
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-700">
                  Active
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpenEdit(true)}
            className="self-start rounded bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 sm:self-center"
          >
            Edit Profile
          </button>
        </div>

        
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Orders", value: stats.orders },
            { label: "Wishlist", value: stats.wishlist },
            { label: "Cart Items", value: stats.cart },
            { label: "Reviews", value: stats.reviews },
          ].map((s, i) => (
            <div
              key={i}
              className="rounded-xl bg-white p-5 text-center shadow transition hover:shadow-md"
            >
              <p className="text-3xl font-extrabold text-red-600">
                {s.value}
              </p>
              <span className="mt-1 block text-sm text-gray-500">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        
        <div className="grid gap-6 md:grid-cols-2">

          
          <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-md">
            <h4 className="mb-4 text-lg font-semibold">
              Account Details
            </h4>

            {[
              { label: "Email", value: user.email },
              { label: "Role", value: user.role },
              { label: "Status", value: "Active" },
              { label: "Joined", value: "Jan 2025" },
            ].map((item, i) => (
              <div
                key={i}
                className="mb-3 flex items-center justify-between text-sm"
              >
                <span className="text-gray-500">
                  {item.label}
                </span>
                <strong className="capitalize text-gray-800">
                  {item.value}
                </strong>
              </div>
            ))}
          </div>

          
          <div className="rounded-xl bg-white p-6 shadow transition hover:shadow-md">
            <h4 className="mb-4 text-lg font-semibold">
              Contact
            </h4>

            <div className="mb-3 flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Phone</span>
              <strong className="text-right text-gray-800">
                {user.phone || "Not added"}
              </strong>
            </div>

            <div className="flex justify-between gap-4 text-sm">
              <span className="text-gray-500">Address</span>
              <strong className="max-w-[60%] break-words text-right text-gray-800">
                {user.address || "Not added"}
              </strong>
            </div>
          </div>
        </div>

        
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
