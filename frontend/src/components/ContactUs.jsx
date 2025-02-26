import React from "react";

const ContactUs = () => {
  return (
    <div className="relative mt-20">
      <div
        className="relative w-full h-[500px] bg-cover bg-center"
        style={{ backgroundImage: "url(/images/contactUs.jpg)" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-700 opacity-50"></div>
        <div className="relative z-10 flex items-center justify-start h-full pl-10 text-white">
          <div className="max-w-lg">
            <h1 className="text-4xl font-bold">Why Contact Us?</h1>
            <p className="mt-4 text-lg">
              We are here to assist you with any inquiries you may have. Whether
              it’s for support, feedback, or any other questions, we are just a
              message away!
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-10 py-10">
        <div className="w-1/2 bg-slate-200 p-3">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <form className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-semibold">
                Name
              </label>
              <input
                id="name"
                type="text"
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

        <div className="w-1/2 relative ml-4 group">
          {/* Image */}
          <img
            src="/images/contact-side-image.jpg"
            alt="Contact Us"
            className="w-full h-full object-cover rounded-lg shadow-xl group-hover:blur-sm transition-all"
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
