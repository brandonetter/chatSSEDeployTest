// chat model
import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
});

export default mongoose?.models?.Chat || mongoose.model('Chat', chatSchema);
