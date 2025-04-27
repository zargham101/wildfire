import { useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import axios from "axios";
 
 const GoogleAuthSuccess = () => {
   const navigate = useNavigate();
 
   useEffect(() => {
     const storeUser = async () => {
       const params = new URLSearchParams(window.location.search);
       const token = params.get("token");
 
       if (token) {
         localStorage.setItem("token", token);
 
         try {
           const response = await axios.get("http://localhost:5001/api/user/profile", {
             headers: {
               Authorization: `Bearer ${token}`,
             },
           });
 
           localStorage.setItem("user", JSON.stringify(response.data));
 
           navigate("/predictionHomePage");
         } catch (error) {
           console.error("Error fetching user profile after Google login", error);
           navigate("/login");
         }
       } else {
         navigate("/login");
       }
     };
 
     storeUser();
   }, [navigate]);
 
   return <p className="text-center mt-20">Logging you in with Google...</p>;
 };
 
 export default GoogleAuthSuccess;