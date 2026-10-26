
import type { RequestHandler } from "express";
import Infrastructure from "../model/Infrastructure.js";

export const getInfrastructure: RequestHandler = async (_req, res) => {
  try {
    const assets = await Infrastructure.find()
      .select("-__v")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: assets.length,
      data: assets,
    });
  } catch (error) {
    console.error("Error fetching infrastructure:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve infrastructure data",
    });
  }
};
