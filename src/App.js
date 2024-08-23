import './App.css';
import React, { useState } from 'react';
import UserList from './Components/UserList';

function App() {
  const [refresh, setRefresh] = useState(false);

  const refreshUsers = () => setRefresh(!refresh);

  return (
    <div className="App">
      <UserList refresh={refresh} refreshUsers={refreshUsers} />
    </div>
  );
}

export default App;
