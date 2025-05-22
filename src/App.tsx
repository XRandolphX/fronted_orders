import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import MyOrders from "./pages/MyOrders";
import OrderForm from "./pages/OrderForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/my-orders" />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/add-order" element={<OrderForm />} />
      <Route path="/add-order/:id" element={<OrderForm />} />
    </Routes>
  );
}

export default App;
