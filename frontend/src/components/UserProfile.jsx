import React, { useState, useEffect } from "react";
import Avatar from "./Avatar";

const UserProfilePage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));

    if (loggedInUser) {
      setUser(loggedInUser); 
    } else {
      console.log("No user found in localStorage");
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/3">
          <h1 className="text-3xl font-bold mb-4 text-center">User Profile</h1>

          <div className="flex justify-center mb-6">
            <Avatar user={user} />
          </div>

          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <div className="text-center">
            <button
              onClick={() => alert("Redirect to Edit Profile page")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading user profile...</p>
      )}
    </div>
  );
};

export default UserProfilePage;
