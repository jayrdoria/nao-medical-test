import mongoose, { Schema, Document as MongoDoc, Model, Types } from "mongoose";

export interface IDocumentShare extends MongoDoc {
  documentId: Types.ObjectId;
  sharedWithId: Types.ObjectId;
  createdAt: Date;
}

const DocumentShareSchema = new Schema<IDocumentShare>(
  {
    documentId: { type: Schema.Types.ObjectId, ref: "Document", required: true },
    sharedWithId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

DocumentShareSchema.index({ documentId: 1, sharedWithId: 1 }, { unique: true });

export const DocumentShare: Model<IDocumentShare> =
  mongoose.models.DocumentShare ??
  mongoose.model<IDocumentShare>("DocumentShare", DocumentShareSchema);
