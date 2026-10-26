
import mongoose, { Schema, Types } from "mongoose";

export interface IQuotaBreach {
  breachedAt: Date;
  consumedKWh: number;
  dailyQuotaKWh: number;
}

export interface IHousehold {
  plotNumber: string;
  street: string;
  dailyKWHQuota: number;
  connectionStatus: "Active" | "Suspended" | "Disconnected";
  quotaBreaches: IQuotaBreach[];
  meterSerialNumber?: string;
  phaseConnection: "Phase 1" | "Phase 2" | "Phase 3";
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const quotaBreachSchema = new Schema<IQuotaBreach>(
  {
    breachedAt: {
      type: Date,
      default: Date.now,
    },
    consumedKWh: {
      type: Number,
      required: true,
    },
    dailyQuotaKWh: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const householdSchema = new Schema<IHousehold>(
  {
    plotNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 50,
    },

    street: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    dailyKWHQuota: {
      type: Number,
      required: true,
      min: 0,
      max: 15,
    },

    connectionStatus: {
      type: String,
      enum: ["Active", "Suspended", "Disconnected"],
      default: "Disconnected",
    },

    quotaBreaches: {
      type: [quotaBreachSchema],
      default: [],
    },

    meterSerialNumber: {
      type: String,
      trim: true,
      unique: true,
      minlength: 10,
      maxlength: 15,
    },

    phaseConnection: {
      type: String,
      enum: ["Phase 1", "Phase 2", "Phase 3"],
      default: "Phase 1",
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Household =
  mongoose.models.Household ||
  mongoose.model<IHousehold>("Household", householdSchema);

export default Household;
