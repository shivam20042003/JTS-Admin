import React, { useEffect, useState } from 'react';

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [poll, setPoll] = useState(false);
  const [filterStatus, setFilterStatus] = useState('Pending'); // Default to "Pending"
  const vendorId = sessionStorage.getItem('vendorID');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/getVendorOrders/${vendorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch orders.');
        }
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data.filter((order) => order.Status === filterStatus));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => setPoll(!poll), 5000);
    fetchOrders();
  }, [vendorId, poll, filterStatus]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/updateOrderStatus`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status.');
      }

      // Update the orders and filtered orders after status change
      const updatedOrders = orders.map((order) =>
        order.Order_id === orderId ? { ...order, Status: newStatus } : order
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders.filter((order) => order.Status === filterStatus));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleStatusFilterChange = (newStatus) => {
    setFilterStatus(newStatus);
    setFilteredOrders(orders.filter((order) => order.Status === newStatus));
  };

  if (loading) return <div className="text-center py-8 text-xl">Loading...</div>;
  if (error) return <div className="text-center py-8 text-xl text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto py-10 px-5">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Vendor Orders</h2>
      <div className="flex justify-center mb-6">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2"
          value={filterStatus}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
        >
          <option value="Pending" className="text-yellow-500">Pending</option>
          <option value="Processing" className="text-blue-500">Processing</option>
          <option value="Completed" className="text-green-500">Completed</option>
          <option value="Cancelled" className="text-red-500">Cancelled</option>
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <div className="text-center text-lg text-gray-600">
          No orders to show for the selected status.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div key={order.Order_id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-300">
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">Order ID: {order.Order_id}</h3>
              <p className="text-gray-700">
                <strong>Customer:</strong> {order.CustomerName}
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> {order.phone}
              </p>
              <p className="text-gray-700">
                <strong>Total Price:</strong> ₹{order.Total_price}
              </p>
              <p className="text-gray-700">
                <strong>Date:</strong> {new Date(order.Order_date).toLocaleString()}
              </p>
              <div className="flex items-center mb-4">
                <p className="text-gray-700 mr-3">
                  <strong>Status:</strong>{' '}
                  <span
                    className={`font-semibold ${
                      order.Status === 'Completed'
                        ? 'text-green-500'
                        : order.Status === 'Pending'
                        ? 'text-yellow-500'
                        : order.Status === 'Processing'
                        ? 'text-blue-500'
                        : 'text-red-500'
                    }`}
                  >
                    {order.Status}
                  </span>
                </p>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  value={order.Status}
                  onChange={(e) => updateOrderStatus(order.Order_id, e.target.value)}
                >
                  <option value="Pending" className="text-yellow-500">
                    Pending
                  </option>
                  <option value="Processing" className="text-blue-500">
                    Processing
                  </option>
                  <option value="Completed" className="text-green-500">
                    Completed
                  </option>
                  <option value="Cancelled" className="text-red-500">
                    Cancelled
                  </option>
                </select>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Items:</h4>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.Product_id} className="flex justify-between items-center text-gray-700">
                    <span>
                      {item.ProductName} - {item.Quantity} pcs
                    </span>
                    <span>₹{item.Item_price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;