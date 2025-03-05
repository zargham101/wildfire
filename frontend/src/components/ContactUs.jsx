import React, { useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react"; // Success icon

const ContactUs = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [showAlert, setShowAlert] = useState(false); // To manage the success alert visibility

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5001/api/review/submit-review", {
        name,
        email,
        country,
        description,
      });

      if (response.status === 200) {
        setShowAlert(true); // Show success alert
        setTimeout(() => {
          setShowAlert(false); // Hide success alert after 3 seconds
          window.location.reload(); // Reload the page after form submission
        }, 3000);

        // Reset form fields after successful submission
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
    <div className="relative mt-20">
      <div className="relative w-full h-[500px] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-700 opacity-50"></div>
        <div className="relative z-10 flex items-center justify-start h-full pl-10 text-white">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold text-black">Why Contact Us?</h1>
            <p className="mt-4 text-lg text-black">
              We are here to assist you with any inquiries you may have. Whether
              it’s for support, feedback, or any other questions, we are just a
              message away!
            </p>
          </div>
        </div>
      </div>

      {/* Success alert */}
      {showAlert && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
          <div className="bg-white text-green-500 p-10 rounded-xl shadow-lg flex flex-col items-center space-y-4 w-80 h-80 border border-green-500">
            <CheckCircle size={48} className="text-green-500" />
            <p className="text-lg text-center">Your message has been sent successfully!</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-10 py-10 border-2 border-slate-200">
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 font-serif">Get in Touch</h2>
          <p className="text-lg  mb-4 font-serif">Please leave a review or recommendation for us to work better</p>
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
                className="border border-gray-300 rounded-lg p-2 mt-2"
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
                className="border border-gray-300 rounded-lg p-2 mt-2"
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
                className="border border-gray-300 rounded-lg p-2 mt-2"
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
                className="border border-gray-300 rounded-lg p-2 mt-2"
                rows="4"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white p-3 rounded-lg mt-4 w-full"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="w-[500px] relative group">
          {/* Image */}
          <img
            src="/images/contact-side-image.jpg"
            alt="Contact Us"
            className="w-full h-[500px] object-cover rounded-lg shadow-xl group-hover:blur-sm transition-all"
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
    </div>
  );
};

export default ContactUs;
