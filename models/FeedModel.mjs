import mongoose from "mongoose";

const { Schema } = mongoose;
const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    creator: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("Post", postSchema);
export { PostModel };
