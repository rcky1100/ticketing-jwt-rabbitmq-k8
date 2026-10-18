import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTickets } from "../services/ticketsService";

import _ from "lodash";

function Tickets() {
  const [tickets, setTickets] = useState([]);

  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id} className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {ticket.title}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {ticket.price}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <Link to={`/tickets/${ticket.id}`}>Edit</Link>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <Link to={`/tickets/view/${ticket.id}`}>view</Link>
        </td>
      </tr>
    );
  });

  useEffect(() => {
    async function fetchData() {
      const tickets = await getTickets();
      setTickets(tickets.data);
    }
    fetchData();
  }, []);

  return (
    <>
      <Link
        to="/tickets/new"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
      >
        New Ticket
      </Link>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                Edit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                View
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ticketList}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Tickets;
