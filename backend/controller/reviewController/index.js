const reviewService = require('../../services/reviewService/index');

const reviewController = {
    submitReview: async (req, res) => {
        try {
            const response = await reviewService.submitReview(req.body);
            res.status(201).json(response);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = reviewController;
