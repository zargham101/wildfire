const userService = require('../../services/userService/userService');

const userController = {
  register: async (req, res) => {
    try {
      const imageUrl = await userService.uploadImageToS3(req.file)

      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }

      const response = await userService.registerUser({ name, email, password, image: imageUrl });
      
      res.status(201).json(response);
    } catch (error) {
      console.log("error:::",error)
      res.status(400).json({ message: error.message });
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
      if (!userId) return res.status(400).json({ message: "User ID is required" });

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
  }
};

module.exports = userController;
