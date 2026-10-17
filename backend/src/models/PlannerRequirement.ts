import mongoose, { Schema } from "mongoose";
import { RequirementModel } from "./Requirement.js";
import type { PlannerDetails } from "./Requirement.js";
import { SERVICES_REQUIRED, PLANNING_SCOPES, EXPERIENCE_LEVELS, CURRENCIES } from "./Requirement.js";

const plannerDetailsSchema = new Schema<{ details: PlannerDetails }>(
  {
    details: {
      type: new Schema<PlannerDetails>(
        {
          guestCount: { type: Number, required: true, min: 1, max: 100000 },
          budget: { type: Number, min: 0 },
          currency: { type: String, enum: CURRENCIES, default: "INR" },
          servicesRequired: {
            type: [{ type: String, enum: SERVICES_REQUIRED }],
            required: true,
            validate: {
              validator: (v: string[]) => v.length >= 1,
              message: "At least one service is required",
            },
          },
          styleTheme: { type: String, trim: true, maxlength: 100 },
          planningScope: { type: String, required: true, enum: PLANNING_SCOPES },
          coordinationDays: { type: Number, required: true, min: 1, max: 90 },
          preferredExperience: { type: String, enum: EXPERIENCE_LEVELS },
          specialRequests: { type: String, trim: true, maxlength: 1000 },
        },
        { _id: false }
      ),
      required: true,
    },
  },
  { _id: false }
);

export const PlannerRequirementModel =
  mongoose.models["planner"] ??
  RequirementModel.discriminator("planner", plannerDetailsSchema);

export default PlannerRequirementModel;
