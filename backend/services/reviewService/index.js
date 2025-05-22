const nodemailer = require('nodemailer');
const Review = require('../../model/reviews/index');
require('dotenv').config();

const reviewService = {
  submitReview: async ({ name, email, country, description }) => {
    try {
      const review = new Review({ name, email, country, description });
      await review.save();

      
      const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS  
        }
      });

      transporter.verify((error, success) => {
        if (error) {
          console.error("SMTP Connection Error:", error);
        } else {
          console.log("SMTP Server is ready to take messages.");
        }
      });

      
      const mailOptions = {
        from: 'hassnainahmadcheema@gmail.com',  
        to: 'hassnainahmadcheema@gmail.com',  
        subject: `New Review from ${name}`,
        replyTo: email,  
        text: `You received a new review from ${name} (${email}, ${country}):\n\n${description}`,
        html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f7f7f7;
                  color: #333;
                  padding: 20px;
                  margin: 0;
                }
                .email-container {
                  max-width: 600px;
                  margin: auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                  text-align: center;
                  margin-bottom: 30px;
                  color: #2a78d4;
                  font-size: 24px;
                }
                .email-content {
                  line-height: 1.6;
                  padding: 20px;
                  border-radius: 5px;
                  background-color: #f9f9f9;
                }
                .user-info p {
                  margin: 10px 0;
                  font-size: 14px;
                  color: #555;
                }
                .review-description {
                  background-color: #e3f2fd;
                  padding: 20px;
                  border-radius: 8px;
                  margin-top: 20px;
                  font-size: 16px;
                  color: #333;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .review-description p {
                  margin: 0;
                  font-size: 15px;
                }
                .email-footer {
                  margin-top: 30px;
                  text-align: center;
                  font-size: 12px;
                  color: #999;
                }
                .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #0000;
                  color: #fff;
                  font-size: 16px;
                  border-radius: 5px;
                  text-decoration: none;
                  margin-top: 20px;
                  transition: background-color 0.3s ease;
                }
                .btn:hover {
                  background-color: #1a5cb8;
                }
                .email-footer a {
                  color: #2a78d4;
                  text-decoration: none;
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <div class="email-header">
                  <h2>New Contact Us Form Submission</h2>
                </div>
                <div class="email-content">
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Country:</strong> ${country}</p>
      
                  <div class="user-info">
                    <p><strong>Message:</strong></p>
                    <div class="review-description">
                      <p>${description}</p>
                    </div>
                  </div>
      
                  <a href="mailto:${email}" class="btn">Reply to ${name}</a>
                  <p>If you have any questions, please don't hesitate to reply to this email.</p>
                </div>
                <div class="email-footer">
                  <p>This is an automated message. Please do not reply directly to this email.</p>
                  <p>To unsubscribe from these notifications, <a href="#">click here</a>.</p>
                </div>
              </div>
            </body>
          </html>
        `
      };
      
      

      
      const info = await transporter.sendMail(mailOptions);

      return { message: 'Review submitted and email sent successfully' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
  getAllReviews: async () => {
    try {
      const reviews = await Review.find();
      const totalReviews = await Review.countDocuments();
      return {reviews,totalReviews}
    } catch (error) {
      throw error
    }
  }
};

module.exports = reviewService;
