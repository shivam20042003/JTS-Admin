import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [vendorName, setVendorName] = useState("Vendor");
  const [profilePhoto, setProfilePhoto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedName = sessionStorage.getItem("vendorName");
    setVendorName(savedName);

    const fetchVendorName = async () => {
      const email = sessionStorage.getItem("vendorEmail");
      if (!email) return;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/vendors/profile?email=${email}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch vendor data");
        }

        const data = await response.json();
        setProfilePhoto(data.profile_photo);
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        alert("Failed to load vendor data.");
      }
    };

    fetchVendorName();
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      sessionStorage.clear();
      localStorage.clear();
      navigate("/"); // Redirect to login
    }
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-4 sticky top-0 shadow-md z-10">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <p>{vendorName}</p>
          <Link to="/profile">
            <img
              src={`data:image/jpeg;base64,${profilePhoto}`}
              alt="Profile"
              className="rounded-full w-10 h-10 object-cover"
            />
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;