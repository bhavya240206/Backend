import express from "express";

import {
  createLead,
  getLeads,
  deleteLead,
  updateLead
}
from "../controllers/leadController";

import protect from "../middleware/authMiddleware";
import adminMiddleware from "../middleware/adminMiddleware";

const router =
  express.Router();

router.route("/")

  .post(protect, createLead)

  .get(protect, getLeads);

router.route("/:id")

  .put(protect, updateLead)

  .delete(
    protect,
    adminMiddleware,
    deleteLead
  );

export default router;