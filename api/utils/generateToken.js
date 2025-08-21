import jwt from "jsonwebtoken";

export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role }, // 👈 payload
    process.env.JWT_SECRET || "yoursecret", // secret
    { expiresIn: "30d" } // token expiry
  );
};
