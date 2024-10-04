import { asyncHandler } from "../utils/AsyncHandler.js";
import Event from "../models/event.models.js"; 
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new event
const createEvent = asyncHandler(async (req, res) => {
    const { title, description, imageurl, date } = req.body;

    // Create new event document
    const event = await Event.create({
        title,
        description,
        imageurl,
        date
    });

    return res.status(201).json(
        new ApiResponse(201, event, "Event created successfully")
    );
});

// Get all events
const getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find();

    return res.status(200).json(
        new ApiResponse(200, events, "Events retrieved successfully")
    );
});

// Edit an existing event by ID
const editEvent = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract ID from the request parameters
    const { title, description, imageurl, date } = req.body;

    // Find the event by ID and update
    const updatedEvent = await Event.findByIdAndUpdate(
        id,
        { title, description, imageurl, date },
        { new: true, runValidators: true }
    );

    if (!updatedEvent) {
        throw new ApiError(404, "Event not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedEvent, "Event updated successfully")
    );
});

// Delete an event by ID
const deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract ID from the request parameters

    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
        throw new ApiError(404, "Event not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Event deleted successfully")
    );
});

// Export the event controller functions
export {
    createEvent,
    getEvents,
    editEvent,
    deleteEvent
};
