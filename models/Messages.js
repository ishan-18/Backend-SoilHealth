const mongoose = require('mongoose')

const MessagesSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Message', MessagesSchema)