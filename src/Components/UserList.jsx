import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserForm from './UserForm';

function UserList({ refresh }) {
  const [users, setUsers] = useState([]);
  console.log(users, "users")
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriterion, setSortCriterion] = useState('name'); 
  const [dropdownOpen, setDropdownOpen] = useState(false); 

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const fetchUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));

    if (storedUsers) {
      setUsers(storedUsers);
    } else {
      axios
        .get('https://jsonplaceholder.typicode.com/users')
        .then((response) => {
          setUsers(response.data);
          localStorage.setItem('users', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error("Error fetching users from API:", error);
        });
    }
  };

  const handleAddUser = (newUser) => {
    const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;
    const nextId = maxId + 1;
    let updatedUsers = [{ ...newUser, id: nextId }, ...users];
    if (sortCriterion === 'name') {
      updatedUsers = updatedUsers.sort((a, b) => {
        return (a.name || '').localeCompare(b.name || '');
      });
    } 
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };
  
  

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleUpdate = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === editingUser.id ? { ...user, ...updatedUser } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setEditingUser(null);
    setShowModal(false);
  };

  const handleDelete = (userId) => {
    const updatedUsers = users.filter((user) => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleCancel = () => {
    setEditingUser(null);
    setShowModal(false);
  };

  const handleSortSelection = (criterion) => {
    setSortCriterion(criterion);
    setDropdownOpen(false);
  };

  const filteredUsers = users
    .filter((user) => {
      const nameMatch =
        user.name && typeof user.name === 'string'
          ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
          : false;

      const idMatch = user.id && user.id.toString().includes(searchTerm);

      return nameMatch || idMatch;
    })
    .sort((a, b) => {
      if (sortCriterion === 'name') {
        return (a.name || '').localeCompare(b.name || '');
      } else if (sortCriterion === 'id') {
        return a.id - b.id;
      }
      return 0;
    });

  return (
    <div className="container mx-auto p-4">
      <div className="w-full flex  justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">User List</h1>
        <div className="flex flex-col lg:flex-row items-center lg:gap-3 w-full lg:w-[40%]">
          <input
            type="text"
            placeholder="Search by Name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded mb-4"
          />
          <div className="relative inline-block text-left w-full">
          <button
            className="bg-white border  w-full lg:w-58 text-black px-4 py-2 rounded mb-4 flex items-center justify-between"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Sort By: {sortCriterion === 'name' ? 'Name' : 'ID'}
            <svg
              className={`ml-2 h-4 w-4 transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 top-9 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <ul className="py-1">
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleSortSelection('name')}
                >
                  Name
                </li>
                <li
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleSortSelection('id')}
                >
                  ID
                </li>
              </ul>
            </div>
          )}
        </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 w-full lg:w-52 rounded mb-4"
            onClick={() => setShowModal(true)}
          >
            Add User
          </button>
        </div>
        
      </div>

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Number</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2 text-center">{user.id}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.phone}</td>
              <td className="border px-4 py-2  w-52  space-y-1 text-center">
                <button
                  onClick={() => handleEdit(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <UserForm
          editingUser={editingUser}
          onSubmit={editingUser ? handleUpdate : handleAddUser}
          onCancel={handleCancel}
          initialData={editingUser || {}}
        />
      )}
    </div>
  );
}

export default UserList;
