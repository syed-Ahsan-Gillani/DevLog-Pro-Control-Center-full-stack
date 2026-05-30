import mongoose from 'mongoose';

// Define the structure of a single Developer Log post
const LogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a log title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a log description']
    },
    category: {
        type: String,
        enum: ['Frontend', 'Backend', 'Database', 'Bugs', 'Learning', 'General'],
        default: 'General'
    },
    tags: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Turn the schema blueprint into a working data model named 'Log'
const Log = mongoose.model('Log', LogSchema);

export default Log;