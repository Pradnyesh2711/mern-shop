import React, { useState } from 'react';
import Modal from 'react-modal'; // Import react-modal library
import { useLoaderData } from 'react-router-dom';
import { BsFillCartPlusFill } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import axios from 'axios'; // Import Axios for making HTTP requests

import Breadcrumb from '../components/Breadcrumb';
import { cartActions } from '../store/cart-slice';
import { numberWithCommas } from '../utils';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff', 
    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)', 
    padding: '40px', 
    borderRadius: '8px', 
    width: '80%', 
    maxWidth: '500px', 
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const Product = () => {
  const product = useLoaderData();
  const { _id, name: initialName, price: initialPrice, description: initialDescription, imagePath } = product;
  const dispatch = useDispatch();

  const [modalIsOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(initialPrice);
  const [description, setDescription] = useState(initialDescription);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddToCart = () => {
    dispatch(cartActions.add(product));
  };

  const handleSave = async () => {
    try {
      // Make API call to update product data
      await axios.put(`/api/products/${_id}`, { name, price, description });
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleCancel = () => {
    // Reset the form fields to their initial values
    setName(initialName);
    setPrice(initialPrice);
    setDescription(initialDescription);
    closeModal();
  };

  return (
    <div className="flex flex-col flex-1 items-center mb-8">
      <Breadcrumb />

      <div className="flex md:w-[890px] flex-col items-center md:flex-row md:items-start">
        <img
          src={imagePath}
          alt={name}
          className="bg-base-200 w-96 h-96 mr-0 md:mr-14 rounded-xl object-cover mb-6 shadow-xl"
        />
        <div className="flex flex-1 flex-col items-start">
          <p className="mb-4 text-xl">{name}</p>
          <p className="text-2xl text-primary mb-5">$ {numberWithCommas(price)}</p>
          <button className="btn btn-primary gap-2 mb-8" onClick={handleAddToCart}>
            <BsFillCartPlusFill className="text-lg" />
            Add To Cart
          </button>
          <button className="btn btn-primary gap-2 mb-8" onClick={openModal}>
            Edit
          </button>
          <p className="mb-1 underline opacity-70">About</p>
          <p className="opacity-70">{description}</p>
        </div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Edit Product Modal"
      >
        <h2>Edit Product</h2>
        <form className="flex flex-col">
          <label htmlFor="name" className="mb-2">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded-md" />

          <label htmlFor="price" className="mb-2">Price:</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded-md" />

          <label htmlFor="description" className="mb-2">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mb-4 p-2 border border-gray-300 rounded-md" />

          <div className="flex justify-between">
            <button className="btn btn-primary" onClick={handleSave}>Save</button>
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Product;
