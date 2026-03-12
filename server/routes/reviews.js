import express from "express";
import { verifyAdmin, verifyToken } from "../utils/verifyToken.js";
import { createReview, deleteReview, getAllReviews, getReviewByEventId, 
         getReviewByUserId, getSingleReview } from "../Controllers/reviewController.js";

const router = express.Router()              

router.post('/', verifyToken, createReview)
router.get('/getReviewByUserId/:id', verifyToken, getReviewByUserId)
router.get('/getReviewByEventId/:id', getReviewByEventId)
router.get('/:id', getSingleReview)
router.get('/', getAllReviews)
router.delete('/:id', verifyToken, deleteReview)

export default router
