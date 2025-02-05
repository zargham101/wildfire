const User = require('../../model/user/index');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userService = {
  registerUser: async ({ name, email, password }) => {
    try {
      let user = await User.findOne({ email });
      if (user) throw new Error('User already exists');

      user = new User({ name, email, password });

      await user.save();
      return {
        user,
        message: 'User registered successfully'
      };
    } catch (error) {
      throw error;
    }
  },

  loginUser: async ({ email, password }) => {
    try {
      console.log("ab iski bari::",email,password)
      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid credentials');

      if (!user.comparePassword) {
        console.error("comparePassword method is missing on user model.");
        throw new Error("Password comparison function not available.");
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) throw new Error('Invalid credentials');

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      return {
        message: 'Login successful',
        token,
        user
      };
    } catch (error) {
      console.error("Error in loginUser:", error.message);
      throw error;
    }
  },
  getUserProfile: async (userId) => {
    try {
      const user = await User.findById(userId).select('-password'); // Exclude password
      if (!user) throw new Error('User not found');

      return user;
    } catch (error) {
      throw error;
    }
  },
  getAllUsers: async () => {
    try {
      console.time("⏳ Fetching All Users");
      const users = await User.find()
        .select('name email role createdAt')
        .lean();
      console.timeEnd("⏳ Fetching All Users");
      return users;
    } catch (error) {
      console.error("No users available")
      throw error;
    }
  },
  updateUser: async (userId, { name, email, password }) => {
    try {
      let updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (password) updateData.password = await bcrypt.hash(password, 10); // Hash password

      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

      if (!updatedUser) throw new Error('User not found');

      return {
        message: 'User updated successfully',
        updatedUser
      };
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) throw new Error('User not found');

      return {
        message: 'User deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  },
  forgotPassword: async (email) => {
    try {
      const user = await User.findOne({ email });
      if (!user) throw new Error('User not found');
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();

      return {
        message: 'Password reset token generated successfully',
        resetToken
      };
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async ({ resetToken, newPassword }) => {
    try {
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() } // Ensure token is still valid
      });

      if (!user) throw new Error('Invalid or expired password reset token');

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          password: hashedPassword,
          resetPasswordToken: undefined,
          resetPasswordExpires: undefined
        },
        { new: true }
      );

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw error;
    }
  }

};

module.exports = userService;
