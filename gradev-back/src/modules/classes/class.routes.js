import { Router } from "express";

import validate from "../../middleware/validate.middleware.js";
import classController from "./class.controller.js";

import { createClassSchema, updateClassSchema } from "./class.validation.js";

const router = Router();

router
  .route("/")
  .post(validate(createClassSchema), classController.create)
  .get(classController.findAll);

router
  .route("/:id")
  .get(classController.findById)
  .patch(validate(updateClassSchema), classController.update)
  .delete(classController.delete);

export default router;
