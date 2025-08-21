import React, { useState } from "react";
import axios from "../api";

const TicketFeedback = ({ suggestionId }) => {
  const [feedback, setFeedback] = useState(null);

  const sendFeedback = async (value) => {
    try {
      await axios.post(`/agent/suggestion/${suggestionId}/feedback`, { value });
      setFeedback(value);
    } catch (err) {
      console.error("Failed to send feedback", err);
    }
  };

  return (
    <div className="flex space-x-2 mt-2">
      <button
        onClick={() => sendFeedback("up")}
        className={`px-3 py-1 rounded ${feedback === "up" ? "bg-green-500 text-white" : "bg-gray-200"}`}
      >
        👍
      </button>
      <button
        onClick={() => sendFeedback("down")}
        className={`px-3 py-1 rounded ${feedback === "down" ? "bg-red-500 text-white" : "bg-gray-200"}`}
      >
        👎
      </button>
    </div>
  );
};

export default TicketFeedback;
