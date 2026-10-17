import mongoose, { Schema } from "mongoose";
import { RequirementModel } from "./Requirement.js";
import type { PerformerDetails } from "./Requirement.js";
import { PERFORMANCE_TYPES, CURRENCIES } from "./Requirement.js";

const performerDetailsSchema = new Schema<{ details: PerformerDetails }>(
  {
    details: {
      type: new Schema<PerformerDetails>(
        {
          performanceType: { type: String, required: true, enum: PERFORMANCE_TYPES },
          performerCount: { type: Number, required: true, min: 1, max: 50 },
          durationMinutes: { type: Number, required: true, min: 5, max: 720 },
          performanceCount: { type: Number, required: true, min: 1, max: 20 },
          genre: { type: String, trim: true, maxlength: 100 },
          soundSystemRequired: { type: Boolean, required: true },
          lightingRequired: { type: Boolean, required: true },
          stageRequired: { type: Boolean, required: true },
          equipmentRequirements: { type: String, trim: true, maxlength: 500 },
          specialInstructions: { type: String, trim: true, maxlength: 1000 },
          budgetMin: { type: Number, min: 0 },
          budgetMax: { type: Number, min: 0 },
          budgetCurrency: { type: String, enum: CURRENCIES, default: "INR" },
        },
        { _id: false }
      ),
      required: true,
    },
  },
  { _id: false }
);

export const PerformerRequirementModel =
  mongoose.models["performer"] ??
  RequirementModel.discriminator("performer", performerDetailsSchema);

export default PerformerRequirementModel;
