import React, { useEffect, useState } from 'react';

const ProductTable = (buul) => {
  const [products, setProducts] = useState([]);
  const [vendorId, setVendorId] = useState(null);
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/products?vendor_id=${vendorId}`); // Adjust API endpoint as per your backend setup
      const data = await response.json();
      setProducts(data.products); // Set products from the backend response
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Unable to fetch products");
    }
  };

  // Fetch vendor ID from session storage
  useEffect(() => {
    const storedVendorId = sessionStorage.getItem("vendorID");
    if (storedVendorId) {
      setVendorId(storedVendorId); // Set vendor ID from session storage
    } else {
      console.log("No vendor ID found in session storage.");
    }
  }, []);

  // Fetch products from the backend API with the vendor_id
  useEffect(() => {
    if (vendorId) {
      
      fetchProducts();
    }
    
  }, [vendorId,buul.buul]); // Re-fetch when vendorId is updated

  // Function to handle product deletion
  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/delete-product/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Product deleted successfully!');
          if (vendorId) {
      fetchProducts();
        }
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Something went wrong while deleting the product');
      }
    }
  };

  // Function to handle product addition (assuming you have a function to call the modal and add a product)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left bg-white rounded shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Image</th>
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Price</th>
            <th className="p-2 text-center">Action</th> {/* Add Action column */}
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.Product_id} className="border-b hover:bg-gray-50">
                {/* Display Image */}
                <td className="p-2">
                  {product.product_image ? (
                    <img
                      src={`data:image/jpeg;base64,${product.product_image}`}
                      alt={product.Name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                </td>
                <td className="p-2">{product.Name}</td>
                <td className="p-2">{product.Description}</td>
                <td className="p-2">₹{product.price}</td>
                {/* Action Column with Delete Button */}
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleDelete(product.Product_id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-2 text-center">No products available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;