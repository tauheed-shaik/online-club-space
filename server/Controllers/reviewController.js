import Review from '../models/Review.js'

//1) TO CREATE A REVIEW
export const createReview = async (req, res) => {
    const { event_id, reviewText, rating, user_id } = req.body

    if (!event_id || !reviewText || rating === undefined || !user_id) {
        return res.status(400).json({ status: "failed", success: "false", 
                                     message: "event_id, user_id, reviewText and rating are required" })
    }

    // Prevent duplicate reviews by same user for same event
    const existing = await Review.findOne({ user_id, event_id })
    if (existing) {
        // Update instead of creating duplicate
        existing.reviewText = reviewText
        existing.rating = rating
        const updated = await existing.save()
        return res.status(200).json({ status: "success", success: "true", 
                                     message: "Your review has been updated", data: updated })
    }

    const newReview = new Review({ user_id, event_id, reviewText, rating })

    try {
        const savedReview = await newReview.save()
        const populated = await savedReview.populate('user_id', 'username photo')
        res.status(200).json({ status: "success", success: "true", 
                             message: "Review Submitted Successfully", data: populated })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false", 
                             message: err.message || "Failed to submit Review" })
    }
}

//2) TO GET REVIEWS BY USER ID
export const getReviewByUserId = async (req, res) => {
    const id = req.params.id

    try {
        const userReviews = await Review.find({ user_id: id })
            .populate('event_id', 'name photo venue')
            .sort({ createdAt: -1 })
        res.status(200).json({ status: "success", success: "true", 
                             message: "Successful", data: userReviews })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false", 
                             message: err.message || "Error: Review Data Not Found." })
    }
}

//3) TO GET SINGLE REVIEW
export const getSingleReview = async (req, res) => {
    const id = req.params.id

    try {
        const singleReview = await Review.findById(id).populate('user_id', 'username photo')
        if (!singleReview) {
            return res.status(404).json({ status: "failed", success: "false", message: "Review Not Found" })
        }
        res.status(200).json({ status: "success", success: "true", 
                             message: "Successful", data: singleReview })
    } catch (err) {
        res.status(404).json({ status: "failed", success: "false",
                             message: err.message || "Error: Review Data Not Found." })
    }
}

//4) TO GET ALL REVIEWS
export const getAllReviews = async (req, res) => {
    try {
        const allReviews = await Review.find({})
            .populate('user_id', 'username photo')
            .populate('event_id', 'name')
            .sort({ createdAt: -1 })
        res.status(200).json({ status: "success", success: "true", count: allReviews.length,
                             message: "Successful", data: allReviews })
    } catch (err) {
        res.status(404).json({ status: "failed", success: "false",
                             message: err.message || "Error: Review Data Not Found." })
    }
}

//5) TO GET REVIEWS BY EVENT ID
export const getReviewByEventId = async (req, res) => {
    const id = req.params.id

    try {
        const reviews = await Review.find({ event_id: id })
            .populate('user_id', 'username photo')
            .sort({ createdAt: -1 })
        res.status(200).json({ status: "success", success: "true", 
                             message: "Successful", data: reviews })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false", 
                             message: err.message || "Error: Review Data Not Found." })
    }
}

//6) TO DELETE A REVIEW
export const deleteReview = async (req, res) => {
    const id = req.params.id
    try {
        await Review.findByIdAndDelete(id)
        res.status(200).json({ status: "success", success: "true", message: "Review Deleted" })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false", message: err.message || "Failed to delete" })
    }
}
