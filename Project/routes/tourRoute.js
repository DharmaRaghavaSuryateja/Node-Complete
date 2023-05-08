const express = require("express");
const router = express.Router();
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter=require('../routes/reviewRoute');

//nested routes to post a review (mergeParams:true)
router.use('/:tourId/reviews',reviewRouter)
// router.param('id',tourController.checkID);

//Middleware
router.route('/top-5-cheap').get(tourController.aliasTours,tourController.getAllTours);
//Aggregation related route
router.route('/tour-stats').get(tourController.tourStats);
router.route('/tour-monthly-stats/:id').get(tourController.getMonthlyStats);
//normal routes
router.route("/").get(tourController.getAllTours).post(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.createTour);
router.route("/:id").get(tourController.getTour).patch(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.updateTour).delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

module.exports=router;