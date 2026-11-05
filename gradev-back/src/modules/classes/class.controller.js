import mongoose from "mongoose";
import classService from "./class.service.js";

class ClassController {
  async create(req, res, next) {
    try {
      const createdClass = await classService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Class created successfully.",
        data: createdClass,
      });
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const { search, book, level, semester } = req.query;

      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

      const result = await classService.findAll({
        search,
        book,
        level,
        semester,
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        data: result.classes,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid class ID.",
        });
      }

      const foundClass = await classService.findById(id);

      if (!foundClass) {
        return res.status(404).json({
          success: false,
          message: "Class not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: foundClass,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid class ID.",
        });
      }

      const updatedClass = await classService.update(id, req.body);

      if (!updatedClass) {
        return res.status(404).json({
          success: false,
          message: "Class not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Class updated successfully.",
        data: updatedClass,
      });
    } catch (error) {
      if (error.statusCode === 400) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;

      if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid class ID.",
        });
      }

      const deletedClass = await classService.delete(id);

      if (!deletedClass) {
        return res.status(404).json({
          success: false,
          message: "Class not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Class deleted successfully. Students have been unassigned.",
      });
    } catch (error) {
      next(error);
    }
  }
}

const classController = new ClassController();

export default classController;
