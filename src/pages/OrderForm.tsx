// frontend-react-base/src/pages/OrderForm.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Order, OrderItem } from "../types/order";

interface Product {
  id: number;
  name: string;
  unit_price: string;
}

const OrderForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderNumber, setOrderNumber] = useState("");
  const [status, setStatus] = useState("Pending");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);

    axios
      .get<Product[]>(import.meta.env.VITE_API_URL + "/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));

    if (id) {
      setLoading(true);
      axios
        .get<Order>(import.meta.env.VITE_API_URL + `/orders/${id}`)
        .then((res) => {
          const data = res.data;
          setOrderNumber(data.order_number);
          setStatus(data.status);
          setDate(data.date.split("T")[0]);
          setItems(data.items || []);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleAddProduct = () => {
    const existing = items.find(
      (i) => i.product_id === Number(selectedProductId)
    );
    if (existing) return alert("Producto ya agregado");

    const product = products.find((p) => p.id === Number(selectedProductId));
    if (!product) return;

    setItems([
      ...items,
      {
        product_id: product.id,
        name: product.name,
        unit_price: product.unit_price,
        quantity,
      },
    ]);
    setSelectedProductId("");
    setQuantity(1);
  };

  const handleRemoveItem = (productId: number) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const total = items.reduce(
    (acc, item) => acc + parseFloat(item.unit_price) * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      order_number: orderNumber,
      date,
      status,
      items,
    };

    try {
      if (id) {
        await axios.put(
          import.meta.env.VITE_API_URL + `/orders/${id}`,
          payload
        );
      } else {
        await axios.post(import.meta.env.VITE_API_URL + "/orders", payload);
      }
      navigate("/my-orders");
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Error saving order");
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-800">
        {id ? "Edit Order" : "Create New Order"}
      </h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-left font-medium mb-1">
              Order Number
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              required
              className="border px-4 py-2 w-full rounded shadow-sm"
            />
          </div>

          <div>
            <label className="block text-left font-medium mb-1">Date</label>
            <input
              type="date"
              value={date}
              disabled
              className="border px-4 py-2 w-full bg-gray-100 rounded"
            />
          </div>

          <div>
            <label className="block text-left font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border px-4 py-2 w-full rounded"
            >
              <option value="Pending">Pending</option>
              <option value="InProgress">InProgress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-3">Add Product</h2>
            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border px-4 py-2 flex-1 rounded"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border px-4 py-2 w-full md:w-24 rounded"
              />
              <button
                type="button"
                onClick={handleAddProduct}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
              >
                Add
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Products in Order</h2>
            <table className="w-full border rounded-lg overflow-hidden">
              <thead className="bg-blue-100">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product_id} className="text-center border-t">
                    <td>{item.name}</td>
                    <td>S/ {item.unit_price}</td>
                    <td>{item.quantity}</td>
                    <td>
                      S/{" "}
                      {(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="text-red-500 hover:underline"
                        onClick={() => handleRemoveItem(item.product_id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr>
                  <td colSpan={3} className="text-right font-semibold">
                    Total:
                  </td>
                  <td colSpan={2} className="font-bold">
                    S/ {total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              Save Order
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default OrderForm;
