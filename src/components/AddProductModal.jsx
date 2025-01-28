import React, { useState } from 'react';

const AddProductModal = ({ closeModal }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage); // Set the selected image file
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Preview image after selection
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  const handleSubmit = async () => {
    // Validate the fields
    if (!product.name || !product.price || !product.description) {
      alert("Please provide all required fields.");
      return;
    }

    const formData = new FormData();
    const vendorID = sessionStorage.getItem('vendorID');

    // Append product data to formData
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('vendor_id', vendorID);

    // Append image file, if available
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/add-product`, {
        method: 'POST',
        body: formData, // Send form data
      });

      if (response.ok) {
        alert('Product added successfully!');
        closeModal(); // Close modal on success
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <div className="space-y-4">
          {/* Name */}
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={product.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={product.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          ></textarea>
          {/* Price */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={product.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
          />
          {imagePreview && (
            <div className="mt-4">
              <h4 className="text-sm">Image Preview:</h4>
              <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
            </div>
          )}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;