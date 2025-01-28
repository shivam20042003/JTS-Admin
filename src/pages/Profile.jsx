import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePhoto: '', // Base64 data for image preview
    profilePhotoFile: null, // File object for uploading
  });
  const [loading, setLoading] = useState(true);
  const [buul,setBuul] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const email = sessionStorage.getItem('vendorEmail');
        if (!email) {
          alert('No vendor email found. Please log in again.');
          return;
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/vendors/profile?email=${email}`);
        const data = await response.json();

        if (Object.keys(data).length === 0) {
          alert('No profile data found.');
        }

        setFormData((prev) => ({
          ...prev,
          ...data,
          profilePhoto: data.Profile_Photo ? `data:image/jpeg;base64,${data.Profile_Photo}` : '', // Convert Base64
        }));
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file change for photo upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: reader.result, // Base64 for preview
          profilePhotoFile: file, // Actual file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile data
  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      return alert('Please fill out all required fields.');
    }

    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/vendors/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  // Save profile photo
  const handleSavePhoto = async () => {
    if (!formData.profilePhotoFile) {
      return alert('Please select a photo to upload.');
    }

    const formDataObject = new FormData();
    const email = sessionStorage.getItem('vendorEmail');
    formDataObject.append('email', email);
    formDataObject.append('photo', formData.profilePhotoFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/vendors/profile-photo`, {
        method: 'PUT',
        body: formDataObject,
      });

      if (response.ok) {
        alert('Profile photo updated successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          profilePhoto: '', // Base64 data for image preview
          profilePhotoFile: null, // File object for uploading
        })
        setBuul(!buul);
      } else {
        alert('Failed to update profile photo.');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Something went wrong.');
    }
  };

  // Display loading message
  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <Navbar buul = {buul} />
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Profile</h1>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow">
        <Navbar buul = {buul}  />
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Profile</h1>
          <div className="bg-white shadow-md rounded p-6">
            <form className="space-y-4">
              <div>
                <label className="block font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                ></textarea>
              </div>
              <div>
                <label className="block font-medium">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded"
                />
              </div>
              {formData.profilePhoto && (
                <div>
                  <img
                    src={formData.profilePhoto}
                    alt="Profile Preview"
                    className="max-w-xs mb-4 rounded shadow"
                  />
                </div>
              )}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={handleSavePhoto}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;