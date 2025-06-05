import React, { useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react"; 

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5001/api/review/submit-review",
        {
          name,
          email,
          country,
          description,
        }
      );

      if (response.status === 200) {
        setShowAlert(true); 
        setTimeout(() => {
          setShowAlert(false);
          window.location.reload(); 
        }, 3000);

        setName("");
        setEmail("");
        setCountry("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error submitting the form", error);
    }
  };

  return (
    <div
      className="relative mt-20"
      style={{
        backgroundImage: `url('images/texture.jpg')`,
        backgroundRepeat: "repeat",
      }}
    >
 



      {showAlert && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
          <div className=" text-green-500 p-10 rounded-xl shadow-lg flex flex-col items-center space-y-4 w-80 h-80 border border-green-500">
            <CheckCircle size={48} className="text-green-500" />
            <p className="text-lg text-center">
              Your message has been sent successfully!
            </p>
          </div>
        </div>
      )}
<div className=" py-8">
  <div className="text-center">
    <h1 className="text-4xl font-bold text-red-600 mb-4">
      Contact us.
    </h1>
    <p className="text-lg text-gray-600">
      This is the place to let us know about things that are not an emergency.
    </p>
  </div>
</div>
<h2 className="t-h4 p-6 keyline-heading font-bold text-white" style={{ backgroundColor: '#d52b1e' }}>
  <span>
    In an emergency you should always call 999. This is an administrative mailbox which is only monitored during office hours, Monday to Friday, 09.00 – 17.00.
  </span>
</h2>


      

      <div className="flex items-center justify-between px-10 py-10 border-2 ">
        
        
        <div className="w-1/2  p-4  ml-[150px]">
          <h2 className="text-2xl font-bold mb-4 font-serif">Get in Touch</h2>
          <p className="text-lg mb-4 font-serif">
            Please leave a review or recommendation for us to work better
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-black  p-2 mt-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-black  p-2 mt-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="country" className="text-sm font-semibold">
                Country
              </label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="border-2 border-black  p-2 mt-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-semibold">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-2 border-black  p-2 mt-2"
                rows="4"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-red-700 text-white mt-2 py-2 hover:bg-white hover:border-b-4 hover:border-red-700 hover:text-black"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="border-l-4 border-red-700 h-[500px] mx-4 ml-[60px]"></div>{" "}
        <div className="w-1/2 relative group ml-[90px] mb-[120px] mr-[250px] mt-[90px]">
          <img
            src="/images/fire12.jpg"
            alt="Contact Us"
            className="w-[415px] h-[500px] object-cover group-hover:blur-sm transition-all"
            style={{ boxShadow: "10px 0px 20px rgba(0, 0, 0, 0.3)" }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all p-4">
            <p className="text-center text-xl font-semibold font-serif">
              "Asking questions and giving us reviews will make us work better
              for a secure and flourishing world for everyone. Let us all
              together make this world a better and safe place to live."
            </p>
          </div>
        </div>
        
      </div>
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
  {/* Heading */}
  <h2 className="text-3xl font-bold text-center mb-8 border-b pb-4">
    General Enquiries and Non-Emergency Assistance
  </h2>

  {/* Contact Box */}
  <div className="p-8">
    {/* Content */}
    <div className="space-y-6">

      {/* Office Timings */}
      <p className="text-lg text-gray-700">
        Our  service is available Monday to Friday, 8:30 AM – 5:00 PM.
      </p>

      {/* Phone Number */}
      <div className="flex items-center space-x-2 text-2xl font-bold text-red-700">
        <span>📞</span>
        <span>041 1400 1500</span>
      </div>

      {/* Divider */}
      <hr className="border-gray-400" />

      {/* Office Address */}
      <h3 className="text-2xl font-semibold text-gray-900">
        Head Office
      </h3>
      <div className="flex items-center space-x-2 text-lg font-bold text-gray-700">
        <span>📍</span>
        <span>392 - Defence Road_Lahore</span>
      </div>

      {/* Google Maps Link */}
      <p>
        <a
          href="https://goo.gl/maps/YTUmPhRMEk62"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center space-x-1"
        >
          <span>View in Google Maps</span> ➔
        </a>
      </p>

    </div>
  </div>
  
</div>


    </div>
  );
};

export default ContactUs;
