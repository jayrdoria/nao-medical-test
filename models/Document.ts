import mongoose, { Schema, Document as MongoDoc, Model, Types } from "mongoose";

export interface IDocument extends MongoDoc {
  title: string;
  content: Record<string, unknown>;
  ownerId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Document: Model<IDocument> =
  mongoose.models.Document ?? mongoose.model<IDocument>("Document", DocumentSchema);
