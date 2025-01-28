import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Registration
  const [formData, setFormData] = useState({
    email: "",
    password: "", // Shared fields for Login and Registration
    kitchenBusinessName: "",
    name: "",
    contact: "",
    dob: "",
    address: "",
    pinCode: "",
    city: "",
    serviceableArea: "",
    bankDetails: "",
    fsaiLicense: "",
    adharDoc: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/vendors/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("vendorEmail", data.vendor.email);
        sessionStorage.setItem("vendorID", data.vendor.id);
        localStorage.setItem("authToken", data.token);
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/vendors/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Registration successful!");
        setIsLogin(true); // Switch to login after successful registration
      } else {
        alert("Error during registration!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isLogin ? "Vendor Login" : "Vendor Registration"}
        </h2>
        {loading ? (
          <p>Loading...</p> // Loader
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                required
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={formData.password}
                required
                className="w-full border rounded p-2"
              />
            </div>
            {!isLogin && (
              <>
                <div>
                  <label className="block">Kitchen/Business Name</label>
                  <input
                    type="text"
                    name="kitchenBusinessName"
                    onChange={handleChange}
                    value={formData.kitchenBusinessName}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block">Name</label>
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    value={formData.name}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block">Contact</label>
                  <input
                    type="tel"
                    name="contact"
                    onChange={handleChange}
                    value={formData.contact}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    onChange={handleChange}
                    value={formData.dob}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block">Address</label>
                  <textarea
                    name="address"
                    onChange={handleChange}
                    value={formData.address}
                    required
                    className="w-full border rounded p-2"
                  ></textarea>
                </div>
                <div>
                  <label className="block">PIN Code</label>
                  <input
                    type="text"
                    name="pinCode"
                    onChange={handleChange}
                    value={formData.pinCode}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block">City</label>
                  <input
                    type="text"
                    name="city"
                    onChange={handleChange}
                    value={formData.city}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block">Serviceable Area</label>
                  <input
                    type="text"
                    name="serviceableArea"
                    onChange={handleChange}
                    value={formData.serviceableArea}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block">Bank Details</label>
                  <input
                    type="text"
                    name="bankDetails"
                    onChange={handleChange}
                    value={formData.bankDetails}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block">FSSAI License Details</label>
                  <input
                    type="text"
                    name="fsaiLicense"
                    onChange={handleChange}
                    value={formData.fsaiLicense}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block">Aadhaar Document ID</label>
                  <input
                    type="text"
                    name="adharDoc"
                    onChange={handleChange}
                    value={formData.adharDoc}
                    required
                    className="w-full border rounded p-2"
                  />
                </div>
              </>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
        )}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="w-full bg-gray-200 mt-4 text-gray-600 p-2 rounded hover:bg-gray-300"
        >
          {isLogin ? "Switch to Registration" : "Switch to Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
