const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: String,
    imagePath: String,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    lamportTimestamp: {  // Added Lamport timestamp field
        type: Number,
        default: 0
    }
}, { timestamps: true });

productSchema.pre('save', function(next) {
    // This code assumes that you have a mechanism to get the latest Lamport timestamp
    const currentHighestTimestamp = getLatestTimestampFromContext();
    if (this.isNew) {
        this.lamportTimestamp = currentHighestTimestamp + 1;
    } else if (this.isModified()) {
        this.lamportTimestamp = Math.max(this.lamportTimestamp, currentHighestTimestamp) + 1;
    }
    next();
});

function getLatestTimestampFromContext() {
    // This is a placeholder. You need to replace this logic with actual retrieval of the timestamp.
    return globalLatestTimestamp;  // Assume it's a global variable or fetched from a cache/service.
}

module.exports = mongoose.model('Product', productSchema);


productSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id
    delete returnedObj._id
    delete returnedObj.__v
  },
})

module.exports = mongoose.model('Product', productSchema)
