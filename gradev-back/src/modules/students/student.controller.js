import mongoose from "mongoose";
import studentService from "./student.service.js";

class StudentController {
  async create(req, res, next) {
    try {
      const createdStudent = await studentService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Student created successfully.",
        data: createdStudent,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "A student with this email already exists.",
        });
      }

      if (error.statusCode === 400) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const { search, classId, book, level, semester, isActive } = req.query;

      if (classId && !mongoose.isValidObjectId(classId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid class ID.",
        });
      }

      const page = Math.max(Number(req.query.page) || 1, 1);

      const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

      let parsedIsActive;

      if (isActive === "true") {
        parsedIsActive = true;
      } else if (isActive === "false") {
        parsedIsActive = false;
      }

      const result = await studentService.findAll({
        search,
        classId,
        book,
        level,
        semester,
        isActive: parsedIsActive,
        page,
        limit,
      });

      return res.status(200).json({
        success: true,
        data: result.students,
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
          message: "Invalid student ID.",
        });
      }

      const foundStudent = await studentService.findById(id);

      if (!foundStudent) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: foundStudent,
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
          message: "Invalid student ID.",
        });
      }

      const updatedStudent = await studentService.update(id, req.body);

      if (!updatedStudent) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Student updated successfully.",
        data: updatedStudent,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "A student with this email already exists.",
        });
      }

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
          message: "Invalid student ID.",
        });
      }

      const deletedStudent = await studentService.delete(id);

      if (!deletedStudent) {
        return res.status(404).json({
          success: false,
          message: "Student not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Student deleted successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
}

const studentController = new StudentController();

export default studentController;
