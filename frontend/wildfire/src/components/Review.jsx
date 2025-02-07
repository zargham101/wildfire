import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form Data:', formData);
  
    try {
      const response = await fetch('http://localhost:5001/api/review/submit-review', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert('Review submitted successfully!');
      } else {
        alert('Failed to submit review');
      }
      console.log('Response from server:', data);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('There was an error submitting your review. Please try again later.');
    }
  };
  

  return (
    <div className="container py-5">
      <h2 className="text-center">Contact Us</h2>
      <p className="text-center">Reach out, and let's create a universe of possibilities together!</p>
      
      <div className="row">
        <div className="col-md-6">
          <h3>Review Message</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Your Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Your Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">Country</label>
              <input
                type="text"
                className="form-control"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="5"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>

        <div className="col-md-6">
          <img
            src="https://via.placeholder.com/500x400"
            alt="Nature"
            className="img-fluid"
            style={{ borderRadius: '10px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
