import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get("/tickets/my");
        setTickets(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Tickets</h1>
      {tickets.length === 0 && <p>No tickets found</p>}
      <ul className="space-y-2">
        {tickets.map((ticket) => (
          <li key={ticket._id} className="flex justify-between items-center p-4 border rounded shadow hover:bg-gray-50">
            <div>
              <span className="font-semibold">{ticket.title}</span> ({ticket.status})
            </div>
            <div className="flex items-center gap-3">
              {/* AI Feedback indicator */}
              {ticket.aiFeedback === "up" && <span className="text-green-500 font-bold">👍</span>}
              {ticket.aiFeedback === "down" && <span className="text-red-500 font-bold">👎</span>}
              
              <Link className="text-blue-500 hover:underline" to={`/tickets/${ticket._id}`}>
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
