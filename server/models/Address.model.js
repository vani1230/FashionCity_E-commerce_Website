import mongoose from 'mongoose'

const AddressSchema = new mongoose.Schema({
    userID : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    notes: String
},{timestamps:true})

const Address = mongoose.model('Address',AddressSchema)

export default Address