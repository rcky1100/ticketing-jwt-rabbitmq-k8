import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../services/orderService";
function Orders() {
  const [orders, setOrders] = useState([]);

  const orderList = orders.map((order) => {
    return (
      <tr key={order.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {order.ticket.title}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {order.status}
        </td>
      </tr>
    );
  });

  useEffect(() => {
    async function fetchData() {
      const orders = await getOrders();
      setOrders(orders.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orderList}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Orders;
