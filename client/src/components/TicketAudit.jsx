import React, { useEffect, useState } from "react";
import axios from "../api";

const TicketAudit = ({ ticketId }) => {
  const [audit, setAudit] = useState([]);

  useEffect(() => {
    const fetchAudit = async () => {
      try {
        const res = await axios.get(`/tickets/${ticketId}/audit`);
        setAudit(res.data);
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
      }
    };
    fetchAudit();
  }, [ticketId]);

  return (
    <div className="mt-4 p-2 border rounded">
      <h4 className="font-semibold mb-2">Audit Timeline</h4>
      {audit.length === 0 ? (
        <p>No audit events yet.</p>
      ) : (
        <ul className="space-y-1">
          {audit.map((event) => (
            <li key={event._id} className="text-sm">
              {event.timestamp} - {event.actor} - {event.action}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TicketAudit;
