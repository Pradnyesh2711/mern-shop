const mongoose = require('mongoose')

const mutualExclusionSchema = mongoose.Schema(
    {
        product_id: {
            type: mongoose.Types.ObjectId,
            ref: 'Product',
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
        }

    },
    { timestamps: true }
)



module.exports = mongoose.model('mutualExlcusion', mutualExclusionSchema)
