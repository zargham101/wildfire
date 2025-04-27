const User = require("../../model/user/index");
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
  registerUser: async ({ name, email, password, image }) => {
    try {

    let user = await User.findOne({ email });
    if (user) throw new Error("User already exists");

    user = new User({ name, email, password, image });

    await user.save();
    return {
      user,
      message: "User registered successfully",
    };
    } catch (error) {
      throw error
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
      if (!user) {
        console.log("error::", user);
        throw new Error("User not found")
      }

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
        from: process.env.EMAIL_USER,
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

      throw new Error(error)
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
  googleLogin: passport.authenticate("google", {
    scope: ["profile", "email"]
  }),
  
  googleCallback: passport.authenticate("google", {
    failureRedirect: "/login",
    session: false
  }),
};

module.exports = userService;
