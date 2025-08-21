import cron from "node-cron";
import Ticket from "../models/Ticket.js";
import AuditLog from "../models/AuditLog.js";

cron.schedule("0 * * * *", async () => {
  console.log("Running SLA check...");
  const tickets = await Ticket.find({ status: "waiting_human" });
  const now = new Date();
  tickets.forEach(async (ticket) => {
    const createdAt = new Date(ticket.createdAt);
    if ((now - createdAt) / (1000 * 60 * 60) > ticket.slaHours) {
      ticket.status = "breached";
      await ticket.save();
      await AuditLog.create({
        ticketId: ticket._id,
        traceId: ticket._id.toString(),
        actor: "system",
        action: "SLA_BREACHED",
        meta: {},
        timestamp: new Date(),
      });
      console.log(`Ticket ${ticket._id} breached SLA`);
    }
  });
});
