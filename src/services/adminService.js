import { getAllProducts } from "./productService";
import { getAllOrders } from "./orderService";
import { getAllUsers } from "./userService";

export const getAdminStats = () => {
  const products = getAllProducts();
  const orders = getAllOrders();
  const users = getAllUsers();

  const totalProducts = products.length;
  const approvedProducts = products.filter(
    (p) => p.status === "APPROVED"
  ).length;

  const pendingProducts = products.filter(
    (p) => p.status === "PENDING"
  ).length;

  const totalOrders = orders.length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0
  );

  const totalSellers = users.filter(
    (u) => u.role === "SELLER"
  ).length;

  const sellerRequests = users.filter(
    (u) => u.role === "SELLER" && u.status === "PENDING"
  ).length;

  return {
    totalProducts,
    approvedProducts,
    pendingProducts,
    totalOrders,
    totalRevenue,
    totalSellers,
    sellerRequests,
  };
};