const User = require("../../model/user/index");
const PendingUser = require("../../model/user/pendingUser");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { s3 } = require("../../config/multerConfig");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const passport = require("passport");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const userService = {
  uploadImageToS3: async (file) => {
    if (!file) return null;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `user_images/${Date.now()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const uploadResult = await s3.upload(params).promise();
      return uploadResult.Location;
    } catch (error) {
      throw new Error("Failed to upload the image to S3", error.message);
    }
  },

  generateOTP: () => {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  },

  generateAndSendOTP: async (name, email) => {
    const existing = await User.findOne({ email });
    if (existing) throw new Error("User already registered.");

    const otp = userService.generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await PendingUser.findOneAndUpdate(
      { email },
      { name, email, otp, otpExpiresAt: expiresAt },
      { upsert: true }
    );

    const emailHtml = `
      <h3>Welcome to Wildfire Watch!</h3>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>Expires in 10 minutes. Or click <a href="http://localhost:3000/confirm-otp?email=${email}">here</a> to confirm.</p>
    `;

    await transporter.sendMail({
      to: email,
      subject: "Verify Your Email - Wildfire Watch",
      html: emailHtml,
    });

    return { message: "OTP sent to email." };
  },

  verifyOTP: async (email, otp) => {
    const pending = await PendingUser.findOne({ email });
    if (!pending) throw new Error("No verification request found.");
    if (pending.otp !== otp) throw new Error("Invalid OTP.");
    if (new Date() > pending.otpExpiresAt) throw new Error("OTP expired.");

    return { name: pending.name, email: pending.email };
  },

  registerUser: async ({ name, email, password, image }) => {
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const pending = await PendingUser.findOne({ email });
      if (!pending)
        throw new Error("Please verify your email before registering");

      if (pending.name !== name)
        throw new Error("Name does not match the verified user");

      const user = new User({ name, email, password, image });
      await user.save();

      await PendingUser.deleteOne({ email });

      const mailOptions = {
        from: `"Wildfire Watch" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: "🎉 Welcome to Wildfire Watch – You're Now a Member!",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <h2 style="color: #e63946; text-align: center;"> Welcome to Wildfire Watch, ${name}! 🔥</h2>
              <p style="font-size: 16px; color: #333;">
                We're thrilled to have you onboard. You've just joined a growing community dedicated to environmental awareness and wildfire safety.
              </p>
              <p style="font-size: 16px; color: #333;">
                With your new account, you can:
              </p>
              <ul style="font-size: 16px; color: #333; padding-left: 20px;">
                <li>🛰️ Monitor wildfire predictions in real time</li>
                <li>🧠 Submit data and images for AI-based analysis</li>
                <li>💬 Leave reviews and feedback for the community</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/login" style="display: inline-block; padding: 12px 24px; background-color: #1d3557; color: white; text-decoration: none; border-radius: 6px; font-size: 16px;">
                  Go to Dashboard →
                </a>
              </div>
              <p style="font-size: 14px; color: #888; text-align: center;">
                If you have any questions, reach out to us at support@wildfirewatch.com<br/>
                Thank you for being part of the mission.
              </p>
              <hr style="border: none; border-top: 1px solid #eee;" />
              <p style="font-size: 12px; color: #aaa; text-align: center;">
                © ${new Date().getFullYear()} Wildfire Watch. All rights reserved.
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      return {
        user,
        message: "User registered successfully. Confirmation email sent.",
      };
    } catch (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
  },
  adminSignUp: async ({ name, email, password, image }) => {
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        throw new Error("User a;ready exists");
      }

      const user = new User({ name, email, password, image });
      await user.save();
      return user;
    } catch (error) {
      console.error("Registration error:", error.message);
      throw error;
    }
  },

  loginUser: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not registered");

      if (!user.comparePassword) {
        console.error("comparePassword method is missing on user model.");
        throw new Error("Password comparison function not available.");
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );

      return {
        message: "Login successful",
        token,
        user,
      };
    } catch (error) {
      console.error("Error in loginUser:", error.message);
      throw error;
    }
  },

  getUserProfile: async (userId) => {
    try {
      const user = await User.findById(userId).select("-password");
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw error;
    }
  },

  getAllUsers: async () => {
    try {
      const users = await User.find()
        .select("name email role createdAt")
        .lean();
      const totalUsers = await User.countDocuments();
      return { users, totalUsers };
    } catch (error) {
      console.error("No users available");
      throw error;
    }
  },
  getUsers: async ({ role, page, limit }) => {
    try {
      const query = {};

      if (role) {
        query.role = role;
      }

      const skip = (page - 1) * limit;

      const users = await User.find(query).skip(skip).limit(Number(limit));


      const totalUsers = await User.countDocuments(query);


      return {
        users,
        totalPages: Math.ceil(totalUsers / limit),
      };
    } catch (error) {
      console.error("Error fetching users in service:", error);
      throw error;
    }
  },
  UserById: async (userId) => {
    try {
      const id = typeof userId === 'object' && userId.id ? userId.id : userId;

      const user = await User.findById(id);
      return user;    
    } catch (error) {
      throw error       
    }
  },
  updateUser: async (userId, { name, email, password }) => {
    try {
      let updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) updateData.password = await bcrypt.hash(password, 10);

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (!updatedUser) throw new Error("User not found");

      return {
        message: "User updated successfully",
        updatedUser,
      };
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) throw new Error("User not found");

      return {
        message: "User deleted successfully",
      };
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();

      const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;

      const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <h2>Password Reset Request</h2>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="padding:10px 20px; background:#007bff; color:white; text-decoration:none; border-radius:5px;">
            Reset Password
          </a>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      return { message: "Password reset link sent successfully" };
    } catch (error) {
      console.error("Error in forgot password:", error.message);
      throw new Error(error);
    }
  },

  resetPassword: async ({ resetToken, newPassword }) => {
    try {
      const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) throw new Error("Invalid or expired password reset token");

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined,
        },
        { new: true }
      );

      return { message: "Password reset successfully" };
    } catch (error) {
      throw error;
    }
  },

  googleLogin: (req, res, next) => {
    const mode = req.query.mode || "login";
    req.session = req.session || {};
    req.session.googleMode = mode;

    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  },

  googleCallback: passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login?google_error=true",
    failureMessage: true,
    session: false,
  }),
};

module.exports = userService;
