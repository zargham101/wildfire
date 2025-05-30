const userService = require("../../services/userService/userService");
const jwt = require("jsonwebtoken");

const userController = {
  register: async (req, res) => {
    try {
      const imageUrl = await userService.uploadImageToS3(req.file);

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email, and password are required" });
      }

      const response = await userService.registerUser({
        name,
        email,
        password,
        image: imageUrl,
      });

      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  adminUserCreation: async (req, res) => {
    try {
      const imageUrl = await userService.uploadImageToS3(req.file);

      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email, and password are required" });
      }

      const response = await userService.adminSignUp({
        name,
        email,
        password,
        imageUrl,
      });
      res.status(201).json(response);
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const response = await userService.loginUser(req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getUserById: async(req,res) =>{
    try {
      const userId = req.params
      const result = await userService.UserById(userId)
      return res.status(200).json(
        result
      )      
    } catch (error) {
      return res.status(400).json({
        message: error.message
      })      
    }
  },
  getProfile: async (req, res) => {
    try {
      const user = await userService.getUserProfile(req.user.id);
      res.status(200).json(user);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const response = await userService.updateUser(req.query.id, req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.query.id;
      if (!userId)
        return res.status(400).json({ message: "User ID is required" });

      const response = await userService.deleteUser(userId);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const response = await userService.forgotPassword(req.body.email);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const response = await userService.resetPassword(req.body);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  googleLoginSuccess: async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(
          "http://localhost:3000/login?error=Authentication failed. Please try again."
        );
      }
      const user = req.user;
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "6h",
        }
      );

      res.redirect(`http://localhost:3000/google-auth-success?token=${token}`);
      // return res.status(200).json({
      //   user,
      //   token
      // })
    } catch (error) {
      return res.status(500).json({
        error: error,
        message: error.message,
      });
    }
  },
  sendOtp: async (req, res) => {
    try {
      const { name, email } = req.body;
      const response = await userService.generateAndSendOTP(name, email);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const response = await userService.verifyOTP(email, otp);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const { role, page = 1, limit = 10 } = req.query;

      const usersData = await userService.getUsers({ role, page, limit });

      res.json({
        data: usersData.users,
        totalPages: usersData.totalPages,
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = userController;
