
import mongoose from "mongoose";
const ComplaintSchema=new mongoose.Schema({
    
      name: String,
  email: String,
  complaint: String,
  location: {
    lat: Number,
    lng: Number,
  },
        
})
const Complaint=mongoose.models.Complaint || mongoose.model
("Complaint",ComplaintSchema)

export default Complaint