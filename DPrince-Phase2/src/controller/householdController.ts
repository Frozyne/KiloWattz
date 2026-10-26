
import type { RequestHandler } from "express";
import Household from "../model/Household.js";

export const getHouseholds: RequestHandler = async (_req, res) => {
  try {
    const households = await Household.find()
      .select("-__v")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: households.length,
      data: households,
    });
  } catch (error) {
    console.error("Error fetching households:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve households",
    });
  }
};
