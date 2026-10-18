import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import * as userService from "./services/userService";
import { jwtDecode } from "jwt-decode";
import OrderDetails from "./components/OrderDetails";
import Orders from "./components/Orders";
import Tickets from "./components/Tickets";
import NewTicket from "./components/NewTicket";
import PurchaseTicket from "./components/PurchaseTicket";
import Home from "./components/Home";
import NotFoundPage from "./components/NotFoundPage";
import Navbar from "./components/NavBar";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Logout from "./components/Logout";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  // Try to read the token from localStorage immediately
  const token = localStorage.getItem("token");
  let initialUser = null;

  if (token) {
    try {
      initialUser = jwtDecode(token);
    } catch (error) {
      console.error("Invalid token");
      localStorage.removeItem("token");
    }
  }

  const [user] = useState(initialUser);

  return (
    <>
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/tickets/view/:id" element={<PurchaseTicket />} />
            <Route path="/tickets/:id" element={<NewTicket />} />
            <Route
              path="/tickets"
              element={
                <PrivateRoute user={user}>
                  <Tickets />
                </PrivateRoute>
              }
            />
            <Route path="/orders/:id" element={<OrderDetails />} />
            <Route
              path="/orders"
              element={
                <PrivateRoute user={user}>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
