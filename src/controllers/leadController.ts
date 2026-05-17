import { Request, Response }
from "express";

import Lead
from "../models/Lead";



// CREATE LEAD
export const createLead =
async (
  req: Request,
  res: Response
) => {

  try {

    const {
      name,
      email,
      status,
      source
    } = req.body;

    const lead =
      await Lead.create({
        name,
        email,
        status,
        source
      });

    res.status(201).json(lead);

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });
  }
};




// GET LEADS
export const getLeads =
async (
  req: Request,
  res: Response
) => {

  try {

    const page =
      Number(req.query.page) || 1;

    const limit = 10;

    const skip =
      (page - 1) * limit;

    const search =
      req.query.search as string;

    const status =
      req.query.status as string;

    const source =
      req.query.source as string;

    const sort =
      req.query.sort as string;

    const filter: any = {};



    // SEARCH
    if (search) {

      filter.$or = [

        {
          name: {
            $regex: search,
            $options: "i"
          }
        },

        {
          email: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }



    // FILTERS
    if (status) {
      filter.status = status;
    }

    if (source) {
      filter.source = source;
    }



    // SORT
    const sortOption: any =
  sort === "oldest"
    ? { createdAt: 1 }
    : { createdAt: -1 };



    const leads =
      await Lead.find(filter)

        .sort(sortOption)

        .skip(skip)

        .limit(limit);



    const total =
      await Lead.countDocuments(
        filter
      );



    res.json({

      leads,

      currentPage: page,

      totalPages:
        Math.ceil(total / limit),

      totalLeads: total
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });
  }
};




// DELETE LEAD
export const deleteLead =
async (
  req: Request,
  res: Response
) => {

  try {

    const lead =
      await Lead.findById(
        req.params.id
      );

    if (!lead) {

      return res.status(404).json({
        message: "Lead not found"
      });
    }

    await lead.deleteOne();

    res.json({
      message: "Lead deleted"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });
  }
};




// UPDATE LEAD
export const updateLead =
async (
  req: Request,
  res: Response
) => {

  try {

    const lead =
      await Lead.findById(
        req.params.id
      );

    if (!lead) {

      return res.status(404).json({
        message: "Lead not found"
      });
    }

    const updatedLead =
      await Lead.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

    res.json(updatedLead);

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });
  }
};