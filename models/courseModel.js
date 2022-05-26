import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    content: {
      type: {},
      minlength: 200,
    },
    embed: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 10000,
      required: true,
    },
    video: {},

    free_preview: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 320,
      required: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: {},
      minlength: 200,
      required: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    image: {},
    category: String,
    published: {
      type: Boolean,
      default: false,
    },
    paid: {
      type: Boolean,
      default: true,
    },
    instructor: {
      type: Object,
      ref: 'User',
      required: true,
    },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);
courseSchema.index({ title: 'text', decription: 'text', slug: 'text' },{
    weights: {
        title: 5,
        description:2,
        slug:5
    }
});

export default mongoose.model('Course', courseSchema);
