import Event from '../models/Event.js'

//1) TO CREATE A NEW EVENT
export const createNewEvent = async (req, res) => {
    const newEvent = new Event(req.body)  // fixed: was missing `new`

    try {
        const savedEvent = await newEvent.save()
        res.status(201).json({ status: "success", success: "true", 
                             message: "Event Successfully Created", data: savedEvent })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false",
                             message: err.message || "Event Cannot be Created. Try again" })
    }
}

//2) TO UPDATE AN EVENT
export const updateEvent = async (req, res) => {
    const id = req.params.id

    try {
        const updatedEvent = await Event.findByIdAndUpdate(id, { $set: req.body }, { new: true })
        if (!updatedEvent) {
            return res.status(404).json({ status: "failed", success: "false", message: "Event Not Found" })
        }
        res.status(200).json({ status: "success", success: "true", 
                             message: "Event Successfully Updated", data: updatedEvent })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false",
                             message: err.message || "Event Cannot be Updated. Try again" })
    }
}

//3) TO DELETE AN EVENT
export const deleteEvent = async (req, res) => {
    const id = req.params.id

    try {
        await Event.findByIdAndDelete(id)
        res.status(200).json({ status: "success", success: "true", 
                             message: "Event Successfully Deleted" })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false",
                             message: err.message || "Event Cannot be Deleted. Try again" })
    }
}

//4) TO GET A SINGLE EVENT
export const getSingleEvent = async (req, res) => {
    const id = req.params.id

    try {
        const singleEvent = await Event.findById(id)
        if (!singleEvent) {
            return res.status(404).json({ status: "failed", success: "false", message: "Event Not Found" })
        }
        res.status(200).json({ status: "success", success: "true", 
                             message: "Successful", data: singleEvent })
    } catch (err) {
        res.status(404).json({ status: "failed", success: "false",
                             message: err.message || "Error: Event Data Not Found." })
    }
}

//5) TO GET ALL EVENTS (with pagination)
export const getAllEvents = async (req, res) => {
    const page = parseInt(req.query.page) || 0

    try {
        const allEvents = await Event.find({}).skip(page * 8).limit(8)
        res.status(200).json({ status: "success", success: "true", count: allEvents.length,
                             message: "Successful", data: allEvents })
    } catch (err) {
        res.status(404).json({ status: "failed", success: "false",
                             message: err.message || "Error: Data Not Found." })
    }
}

//6) TO GET EVENTS BY SEARCH
export const getEventsBySearch = async (req, res) => {
    const name = req.query.name ? new RegExp(req.query.name, 'i') : /.*/
    const area = req.query.area || ''
    const maxGuestSize = parseInt(req.query.maxGuestSize) || 0

    try {
        const events = await Event.find({
            name,
            ...(area && { address: { $regex: area, $options: 'i' } }),
            maxGuestSize: { $gte: maxGuestSize }
        })
        res.status(200).json({ status: "success", success: "true",
                             message: "Successful", data: events })
    } catch (err) {
        res.status(404).json({ status: "failed", success: "false",
                             message: err.message || "Error: Data Not Found." })
    }
}

//7) TO GET ONLY FEATURED EVENTS
export const getFeaturedEvents = async (req, res) => {
    try {
        const featuredEvents = await Event.find({ featured: true }).limit(8)
        res.status(200).json({ status: "success", success: "true", count: featuredEvents.length,
                             message: "Successful", data: featuredEvents })
    } catch (err) {
        res.status(404).json({ status: "failed", success: "false",
                             message: err.message || "Error: Data Not Found." })
    }
}

//8) TO GET EVENTS COUNT
export const getEventsCount = async (req, res) => {
    try {
        const eventCount = await Event.estimatedDocumentCount()
        res.status(200).json({ status: "success", success: "true",
                             message: "Successful", data: eventCount })
    } catch (err) {
        res.status(500).json({ status: "failed", success: "false",
                             message: err.message || "Error: Failed to Fetch." })
    }
}
