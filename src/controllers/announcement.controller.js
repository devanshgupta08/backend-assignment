import { asyncHandler } from "../utils/AsyncHandler.js";
import Announcement from "../models/announcement.model.js"; // Adjust the path based on your structure
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new announcement
const createAnnouncement = asyncHandler(async (req, res) => {
    const { title, description, date, link } = req.body;

    // Create new announcement document
    const announcement = await Announcement.create({
        title,
        description,
        date,
        link
    });

    return res.status(201).json(
        new ApiResponse(201, announcement, "Announcement created successfully")
    );
});

// Get all announcements
const getAnnouncements = asyncHandler(async (req, res) => {
    const announcements = await Announcement.find();

    return res.status(200).json(
        new ApiResponse(200, announcements, "Announcements retrieved successfully")
    );
});

// Edit an existing announcement by ID
const editAnnouncement = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract ID from the request parameters
    const { title, description, date, link } = req.body;

    // Find the announcement by ID and update
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
        id,
        { title, description, date, link },
        { new: true, runValidators: true }
    );

    if (!updatedAnnouncement) {
        throw new ApiError(404, "Announcement not found");
    }

    return res.status(200).json(
        new ApiResponse(200, updatedAnnouncement, "Announcement updated successfully")
    );
});

// Delete an announcement by ID
const deleteAnnouncement = asyncHandler(async (req, res) => {
    const { id } = req.params; // Extract ID from the request parameters

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
        throw new ApiError(404, "Announcement not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Announcement deleted successfully")
    );
});

// Export the announcement controller functions
export {
    createAnnouncement,
    getAnnouncements,
    editAnnouncement,
    deleteAnnouncement
};
