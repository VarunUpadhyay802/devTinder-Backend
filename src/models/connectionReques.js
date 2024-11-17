const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", //reference to the user collection
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored", "interested", "accepted", "rejected"],
                message: ` `,
            },
        },
    },
    { timestamps: true }
);

// ConnectionRequest.find({fromUserId: 273478465864786587, toUserId: 273478465864786587})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//pre is kind of middleware 
//whenever you are writing a schema method like below , never use arrow function
//before yous save it this function will be called

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    // Check if the fromUserId is same as toUserId
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself!");
    }
    next();
});

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;