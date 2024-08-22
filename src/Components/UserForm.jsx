// UserForm.js
import React, { useState, useEffect } from "react";

function UserForm({ editingUser, onSubmit, onCancel, initialData = {} }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");

  useEffect(() => {
    if (editingUser) {
      setName(initialData.name || "");
      setEmail(initialData.email || "");
      setNumber(initialData.phone || "");
    }
  }, [editingUser, initialData]);

  const handleSubmit = () => {
    onSubmit({ name, email, phone: number });
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setNumber("");
    onCancel();
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-2 py-1 border rounded mr-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-2 py-1 border rounded mr-2"
      />
      <input
        type="text"
        placeholder="Phone Number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        className="px-2 py-1 border rounded mr-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        {editingUser ? "Update User" : "Add User"}
      </button>
      {editingUser && (
        <button
          onClick={resetForm}
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

export default UserForm;
