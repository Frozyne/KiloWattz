
import mongoose, { Schema } from "mongoose";

export interface IInfrastructure {
  name: string;

  type:
    | "SolarArray"
    | "Inverter"
    | "BatteryBank"
    | "Transformer"
    | "Gateway";

  capacityKW?: number;
  capacityKWh?: number;

  status:
    | "Operational"
    | "MaintenanceRequired"
    | "UnderMaintenance"
    | "Offline";

  healthPercent: number;
  lastMaintenanceDate?: Date;

  diagnostics?: {
    voltageV?: number;
    temperatureC?: number;
    efficiencyPercent?: number;
    currentOutputKW?: number;
    stateOfChargePercent?: number;
  };

  maintenanceLogs?: {
    performedAt: Date;
    performedBy: string;
    notes: string;
    statusAfter:
      | "Operational"
      | "MaintenanceRequired"
      | "UnderMaintenance"
      | "Offline";
  }[];
}

const infrastructureSchema = new Schema<IInfrastructure>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "SolarArray",
        "Inverter",
        "BatteryBank",
        "Transformer",
        "Gateway",
      ],
      required: true,
    },

    capacityKW: {
      type: Number,
      min: 0,
    },

    capacityKWh: {
      type: Number,
      min: 0,
    },

    status: {
      type: String,
      enum: [
        "Operational",
        "MaintenanceRequired",
        "UnderMaintenance",
        "Offline",
      ],
      default: "Operational",
      required: true,
    },

    healthPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    lastMaintenanceDate: {
      type: Date,
    },

    diagnostics: {
      voltageV: Number,
      temperatureC: Number,
      efficiencyPercent: {
        type: Number,
        min: 0,
        max: 100,
      },
      currentOutputKW: {
        type: Number,
        min: 0,
      },
      stateOfChargePercent: {
        type: Number,
        min: 0,
        max: 100,
      },
    },

    maintenanceLogs: [
      {
        performedAt: {
          type: Date,
          required: true,
        },
        performedBy: {
          type: String,
          required: true,
        },
        notes: {
          type: String,
          required: true,
        },
        statusAfter: {
          type: String,
          enum: [
            "Operational",
            "MaintenanceRequired",
            "UnderMaintenance",
            "Offline",
          ],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Infrastructure =
  mongoose.models.Infrastructure ||
  mongoose.model<IInfrastructure>(
    "Infrastructure",
    infrastructureSchema
  );

export default Infrastructure;
