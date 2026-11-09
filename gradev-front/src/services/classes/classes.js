import { del, get, patch, post } from "../base-api";
const CLASSES_URL = "/classes";

const classesServices = {
  // GET: Retrieve all classes
  getClasses: (params = {}) => get(`${CLASSES_URL}/getAllClasses`, { params }),

  // GET: Retrieve a class by ID
  getClassById: (id) => get(`${CLASSES_URL}/getClassById/${id}`),

  // POST: Create a new class
  createClass: (classData) => post(`${CLASSES_URL}/createClass`, classData),

  // PATCH: Update a class
  updateClass: (id, classData) =>
    patch(`${CLASSES_URL}/updateClass/${id}`, classData),

  // DELETE: Delete a class
  deleteClass: (id) => del(`${CLASSES_URL}/deleteClass/${id}`),
};

export default classesServices;
