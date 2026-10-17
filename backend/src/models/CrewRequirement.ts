import mongoose, { Schema } from "mongoose";
import { RequirementModel } from "./Requirement.js";
import type { CrewDetails } from "./Requirement.js";
import { CREW_ROLES, EXPERIENCE_LEVELS } from "./Requirement.js";

const crewDetailsSchema = new Schema<{ details: CrewDetails }>(
  {
    details: {
      type: new Schema<CrewDetails>(
        {
          roles: {
            type: [{ type: String, enum: CREW_ROLES }],
            required: true,
            validate: {
              validator: (v: string[]) => v.length >= 1,
              message: "At least one role is required",
            },
          },
          crewCount: { type: Number, required: true, min: 1, max: 500 },
          shiftHours: { type: Number, required: true, min: 0.5, max: 24 },
          shiftCount: { type: Number, required: true, min: 1, max: 90 },
          experienceLevel: { type: String, required: true, enum: EXPERIENCE_LEVELS },
          equipmentRequired: { type: String, trim: true, maxlength: 500 },
          dressCode: { type: String, trim: true, maxlength: 200 },
          reportingInstructions: { type: String, trim: true, maxlength: 500 },
          specialRequests: { type: String, trim: true, maxlength: 1000 },
        },
        { _id: false }
      ),
      required: true,
    },
  },
  { _id: false }
);

export const CrewRequirementModel =
  mongoose.models["crew"] ??
  RequirementModel.discriminator("crew", crewDetailsSchema);

export default CrewRequirementModel;
