import mongoose, { Schema, Model, Document } from 'mongoose';

interface MessageDocument extends Document {
    room: string;
    username: string;
    message: string;
    createdAt: Date;
}

const MessageSchema: Schema = new mongoose.Schema({
    room: { type: String, required: true },
    username: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Message: Model<MessageDocument> = mongoose.model<MessageDocument>('Message', MessageSchema);

export default Message;

