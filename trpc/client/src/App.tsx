import { useState, useEffect } from 'react'
import './App.css'
import client from './client'

function App() {
  // State for the server's welcome message
  const [message, setMessage] = useState('');
  // State for the list of all users
  const [users, setUsers] = useState<any[]>([]);
  // State for a single user fetched by ID
  const [singleUser, setSingleUser] = useState<any>(null);
  // State for the user ID input field
  const [userId, setUserId] = useState('');
  // State for the new user's name input field
  const [newUserName, setNewUserName] = useState('');
  // State for the new user's email input field
  const [newUserEmail, setNewUserEmail] = useState('');

  // Function to fetch all users and update state
  const fetchUsers = () => {
    // Accessing the nested router: client.users.getUsers
    client.users.getUsers.query().then(setUsers);
  };

  // On component mount, fetch the welcome message and the initial user list
  useEffect(() => {
    client.sayHi.query().then(setMessage);
    fetchUsers();
  }, []);

  // Handler for the "Get User by ID" form submission
  const handleGetUserById = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(userId, 10);
    if (!isNaN(id)) {
      try {
        // Calling a query with an input object
        const user = await client.users.getUserById.query({ id });
        setSingleUser(user);
      } catch (error) {
        console.error('Error fetching single user:', error);
        setSingleUser(null);
      }
    }
  };

  // Handler for the "Create User" form submission
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Calling a mutation with an input object
      await client.users.createUser.mutate({ name: newUserName, email: newUserEmail });
      setNewUserName('');
      setNewUserEmail('');
      fetchUsers(); // Refresh the user list after creating a new one
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>tRPC Demo</h1>
        <p>{message}</p>
      </header>

      <div className="grid-container">
        <div className="card">
          <h2>Create User</h2>
          <form onSubmit={handleCreateUser}>
            <input
              type="text"
              placeholder="Name"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
            <button type="submit">Create User</button>
          </form>
        </div>

        <div className="card">
          <h2>Get User by ID</h2>
          <form onSubmit={handleGetUserById}>
            <input
              type="number"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
            <button type="submit">Get User</button>
          </form>
          {singleUser && (
            <div className="user-found">
              <h3>User Found:</h3>
              <p><strong>{singleUser.name}</strong> - {singleUser.email}</p>
            </div>
          )}
        </div>

        <div className="card">
          <h2>All Users</h2>
          {users.length > 0 ? (
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  <span><strong>{user.name}</strong> - {user.email}</span>
                  <span>ID: {user.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default App;
