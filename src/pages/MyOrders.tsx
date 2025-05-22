import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Order } from "../types/order";

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://backend-orders-production.up.railway.app/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this order?")) {
      await axios.delete(
        `https://backend-orders-production.up.railway.app/api/orders/${id}`
      );
      setOrders((prev) => prev.filter((order) => order.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => navigate("/add-order")}
      >
        Add Order
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th>ID</th>
            <th>Order #</th>
            <th>Date</th>
            <th># Products</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="text-center border-t">
              <td>{order.id}</td>
              <td>{order.order_number}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{order.items?.length || "N/A"}</td>
              <td>S/ {order.total_price}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded"
                  onClick={() => navigate(`/add-order/${order.id}`)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-600 text-white rounded"
                  onClick={() => handleDelete(order.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;
