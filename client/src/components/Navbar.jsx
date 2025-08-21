import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="text-lg font-bold">
        <Link to="/">Smart Helpdesk</Link>
      </div>
      <div className="space-x-4">
        {token ? (
          <>
            <Link to="/tickets" className="hover:underline">My Tickets</Link>
            <Link to="/tickets/create" className="hover:underline">Create Ticket</Link>
            <button onClick={handleLogout} className="bg-red-500 px-2 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
