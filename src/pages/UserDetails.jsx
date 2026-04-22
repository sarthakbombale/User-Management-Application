import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../services/api';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    userService.getById(id).then(({ data }) => setUser(data));
  }, [id]);

  if (!user) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="space-y-2">
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
      </div>
      <button onClick={() => navigate('/users')} className="mt-6 bg-gray-500 text-black px-4 py-2 rounded">Back</button>
    </div>
  );
};

export default UserDetails;