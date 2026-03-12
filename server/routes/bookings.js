import express from "express";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";
import { createBooking, deleteBooking, 
         getAllBookings, getBooking, getBookingsByUserId, updateBooking } from "../Controllers/bookingController.js";  

const router = express.Router()              

router.post('/', verifyToken, createBooking)
router.get('/user/:userId', verifyToken, getBookingsByUserId)
router.get('/:id', verifyToken, getBooking)
router.get('/', verifyAdmin, getAllBookings)
router.put('/:id', verifyAdmin, updateBooking)
router.delete('/:id', verifyToken, deleteBooking)

export default router
