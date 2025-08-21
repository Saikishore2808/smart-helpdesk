import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ticket details
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${id}`);
        setTicket(res.data);
      } catch (err) {
        console.error("Failed to fetch ticket:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  // Submit AI feedback
  const handleFeedback = async (feedback) => {
    try {
      const { data } = await api.patch(`/tickets/${id}/feedback`, { feedback });
      setTicket((prev) => ({ ...prev, aiFeedback: data.aiFeedback }));
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  };

  if (loading) return <p className="p-4">Loading ticket...</p>;
  if (!ticket) return <p className="p-4 text-red-500">Ticket not found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">{ticket.title}</h2>
      <p className="mb-2"><strong>Status:</strong> <span className="capitalize">{ticket.status}</span></p>
      <p className="mb-2"><strong>Description:</strong> {ticket.description}</p>
      <p className="mb-4"><strong>Created By:</strong> {ticket.createdBy}</p>

      {/* AI Feedback Section */}
      <div className="mt-6 border-t pt-4">
        <h3 className="font-semibold mb-2">AI Reply Feedback</h3>
        <div className="flex items-center gap-4">
          <button
            className={`text-2xl transition-colors ${
              ticket.aiFeedback === "up" ? "text-green-500" : "text-yellow-500 hover:text-green-500"
            }`}
            onClick={() => handleFeedback("up")}
          >
            👍
          </button>
          <button
            className={`text-2xl transition-colors ${
              ticket.aiFeedback === "down" ? "text-red-500" : "text-yellow-500 hover:text-red-500"
            }`}
            onClick={() => handleFeedback("down")}
          >
            👎
          </button>
          {ticket.aiFeedback && (
            <span className="ml-2 text-sm text-gray-600">
              You rated this AI reply as <strong>{ticket.aiFeedback === "up" ? "Helpful" : "Not Helpful"}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
