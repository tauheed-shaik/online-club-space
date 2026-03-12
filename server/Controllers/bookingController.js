import Booking from '../models/Booking.js'
import Event from '../models/Event.js'

//1) TO CREATE A BOOKING
export const createBooking = async (req, res) => {
    const { timeslot_id, bookingDate, event_id, guestSize, user_id } = req.body

    if (!event_id || !bookingDate || !guestSize || !user_id) {
        return res.status(400).json({ status: "failed", success: "false", 
                                     message: "event_id, bookingDate, guestSize and user_id are required" })
    }

    try {
        // Check for existing booking at the same slot
        if (timeslot_id) {
            const existingBooking = await Booking.findOne({ event_id, timeslot_id, bookingDate })
            if (existingBooking) {
                return res.status(400).json({ status: "failed", success: "false",
                                             message: "This time slot is already booked for that date. Please choose another." })
            }
        }

        // Validate guest size against event limits
        const event = await Event.findById(event_id)
        if (!event) {
            return res.status(404).json({ status: "failed", success: "false", message: "Event not found" })
        }
        if (guestSize < event.minGuestSize || guestSize > event.maxGuestSize) {
            return res.status(400).json({ 
                status: "failed", success: "false",
                message: `Guest size must be between ${event.minGuestSize} and ${event.maxGuestSize}` 
            })
        }

        const newBooking = new Booking(req.body)
        const savedBooking = await newBooking.save()

        res.status(200).json({ status: "success", success: "true", 
                               message: "Your booking is confirmed!", data: savedBooking })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false", 
                               message: err.message || "Failed to create booking" })
    }
}

//2) TO GET BOOKING DETAILS BY ID
export const getBooking = async (req, res) => {
    const id = req.params.id

    try {
        const singleBooking = await Booking.findById(id)
            .populate('user_id', 'username email photo')
            .populate('event_id', 'name venue address photo price')
            .populate('timeslot_id', 'start_time end_time')
        if (!singleBooking) {
            return res.status(404).json({ status: "failed", success: "false", message: "Booking Not Found" })
        }
        res.status(200).json({ status: "success", success: "true", message: "Successful", data: singleBooking })
    } catch (err) {
        res.status(404).json({ status: "failed", success: "false", 
                               message: err.message || "Booking Not Found" })
    }
}

//3) TO GET ALL BOOKINGS BY USER ID
export const getBookingsByUserId = async (req, res) => {
    const userId = req.params.userId

    try {
        const bookings = await Booking.find({ user_id: userId })
            .populate('event_id', 'name venue address photo price')
            .populate('timeslot_id', 'start_time end_time')
            .sort({ createdAt: -1 })

        res.status(200).json({ status: "success", success: "true", 
                               message: "Successful", count: bookings.length, data: bookings })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false", 
                               message: err.message || "Could not fetch your bookings" })
    }
}

//4) TO GET ALL BOOKINGS (admin)
export const getAllBookings = async (req, res) => {
    try {
        const allBookings = await Booking.find()
            .populate('user_id', 'username email')
            .populate('event_id', 'name venue')
            .populate('timeslot_id', 'start_time end_time')
            .sort({ createdAt: -1 })

        res.status(200).json({ status: "success", success: "true", 
                               message: "Successful", count: allBookings.length, data: allBookings })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false", 
                               message: err.message || "Internal Server Error" })
    }
}

//5) TO DELETE A BOOKING
export const deleteBooking = async (req, res) => {
    const id = req.params.id

    try {
        await Booking.findByIdAndDelete(id)
        res.status(200).json({ status: "success", success: "true", 
                             message: "Booking Successfully Deleted" })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false",
                             message: err.message || "Booking Cannot be Deleted. Try again" })
    }
}

//6) TO UPDATE A BOOKING
export const updateBooking = async (req, res) => {
    const id = req.params.id

    try {
        const updated = await Booking.findByIdAndUpdate(id, { $set: req.body }, { new: true })
        res.status(200).json({ status: "success", success: "true", 
                             message: "Booking Successfully Updated", data: updated })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false",
                             message: err.message || "Booking Cannot be Updated. Try again" })
    }
}