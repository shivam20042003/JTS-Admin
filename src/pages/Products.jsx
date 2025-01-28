import React, { useEffect, useState } from 'react';
import ProductTable from '../components/ProductTable';
import AddProductModal from '../components/AddProductModal';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Products = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [buul,setBuul] = useState(false);
  useEffect(()=>{
    setBuul(!buul);
  },[modalOpen])
  return (
    <div className="flex">
        <Sidebar />
        <div className="flex-grow">
          <Navbar />
          <div className="p-6">
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>
      <ProductTable  buul = {buul}/>
      {modalOpen && <AddProductModal closeModal={() => setModalOpen(false)} />}
    </div>
    </div></div></div>
  );
};

export default Products;