import mongoose from "mongoose";

const gameSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Current level & stage
    level: {
      type: Number,
      required: true,
      default: 1,
    },
    stage: {
      type: Number,
      required: true,
      default: 1,
    },

    // Colors generated for this stage
    colors: [
      {
        color: { type: String },
        isPhishing: { type: Boolean, default: false },
        clicked: { type: Boolean, default: false },
      },
    ],

    // Tracking safe clicks
    safeClicks: {
      type: Number,
      default: 0,
    },

    // ✅ NEW: number of safe clicks required to complete stage
    goal: {
      type: Number,
      default: 0,
    },

    // Lives remaining in this session
    lives: {
      type: Number,
      default: 3,
    },

    // Whether stage/level completed
    isCompleted: {
      type: Boolean,
      default: false,
    },

    badges: {
  type: [String],
  default: [],
},

  },
  { timestamps: true }
);

const GameSession = mongoose.model("GameSession", gameSessionSchema);
export default GameSession;
