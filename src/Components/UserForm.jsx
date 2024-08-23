import React, { useState, useEffect } from 'react';

function UserForm({ editingUser, onSubmit, onCancel, initialData = {} }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');

  useEffect(() => {
    if (editingUser) {
      setName(initialData.name || '');
      setEmail(initialData.email || '');
      setNumber(initialData.phone || '');
    }
  }, [editingUser, initialData]);

  const handleSubmit = () => {
    onSubmit({ name, email, phone: number });
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setNumber('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <input type="text" />
      <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">
          {editingUser ? 'Edit User' : 'Add User'}
        </h2>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-2"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full px-4 py-2 border rounded mb-4"
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            {editingUser ? 'Update User' : 'Add User'}
          </button>
          <button
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserForm;
