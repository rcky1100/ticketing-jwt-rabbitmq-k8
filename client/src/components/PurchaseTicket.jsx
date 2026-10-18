import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTicket } from "../services/ticketsService";
import * as orderService from "../services/orderService";

const PurchaseTicket = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [ticket, setTicket] = useState({});

  const createOrder = async () => {
    try {
      const { data } = await orderService.createOrder({
        ticketId: ticket.id,
      });
      navigate(`/orders/${data.id}`);
    } catch (ex) {
      //if (ex.response && ex.response.status === 404) navigate("/404");
    }
  };

  const populateTicket = async () => {
    try {
      const { data } = await getTicket(id);
      setTicket(data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) navigate("/404");
    }
  };

  useEffect(() => {
    async function fetchData() {
      await populateTicket();
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {ticket.title}
        </h2>

        <button
          onClick={createOrder}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Purchase
        </button>
      </div>
    </div>
  );
};

export default PurchaseTicket;
