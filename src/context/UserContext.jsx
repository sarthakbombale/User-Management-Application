import { createContext, useState, useContext } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // You can move your fetchUsers logic here to make it accessible everywhere
  
  return (
    <UserContext.Provider value={{ users, setUsers, loading, setLoading }}>
      {children}
    </UserContext.Provider>
  );
};