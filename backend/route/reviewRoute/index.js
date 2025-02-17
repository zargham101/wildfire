const express = require('express');
const reviewController = require('../../controller/reviewController/index');
const validate = require('../../middleware/validate'); 
const validation = require('../../validator/validate'); 

const router = express.Router();


router.post('/submit-review', validate(validation.reviewValidation), reviewController.submitReview);
router.get('/getAllReview', reviewController.getAllReviews);

module.exports = router;
