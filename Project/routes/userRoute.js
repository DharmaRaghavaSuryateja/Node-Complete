const express = require('express');
const router=express.Router();
const userController=require('../controllers/userController');
const authController=require('../controllers/authController');
router.post('/sign-up',authController.signUp);
router.post('/login',authController.login)
router.post('/forgotPassword',authController.forgotPassword);
router.post('/resetPassword/:normalCryptoToken',authController.resetPassword)
//middleware that protects below routes
router.use(authController.protect)

router.patch('/updatePassword',authController.updatePassword);
router.patch('/updateBio',userController.updateBio)
router.delete('/deleteMe',userController.deleteMe);

//middleware that restrict access to admins only and the [updateBio,deleteMe(for users updateBio updates name and email) vs updateUser,deleteUser(for admins)]
router.use(authController.restrictTo('admin'));
router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports=router;