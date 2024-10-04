import mongoose, { Schema } from "mongoose";

const announcementSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	date: {
		type: String,
		required: true,
	},
	link: {
		type: String,
		required: true,
	},
});

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;
