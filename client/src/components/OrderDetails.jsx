import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import { getOrder } from "../services/orderService";
import { makePayment } from "../services/paymentService";
const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState({ id: "2343" });
  const [timeLeft, setTimeLeft] = useState(0);
  const [errors, setErrors] = useState({});

  const onToken = async (token) => {
    try {
      const { data } = await makePayment({ token: token.id, orderId: id });
      navigate(`/orders`);
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>,
      );
    }
  };

  const populateOrder = async () => {
    try {
      const { data } = await getOrder(id);
      setOrder(data);
    } catch (ex) {
      if (ex.response && ex.response.status === 404) navigate("/404");
    }
  };

  useEffect(() => {
    populateOrder();
  }, [id]); // only run when id changes

  useEffect(() => {
    if (!order.expiresAt) return;

    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [order.expiresAt]);
  const textToShow =
    timeLeft < 0 ? "Order Expired" : `Time left to pay: ${timeLeft} seconds`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {textToShow}
        </h2>
        {timeLeft >= 0 && (
          <StripeCheckout
            token={onToken}
            stripeKey="pk_test_JMdyKVvf8EGTB0Fl28GsN7YY"
          />
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
