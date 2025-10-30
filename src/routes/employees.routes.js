import { Router } from 'express';
import { body, param } from 'express-validator';
import * as c from '../controllers/employees.controller.js';

const r = Router();

// Validation chains reused across handler definitions to keep routing concise.
const validateId = [param('id').isInt().withMessage('id must be an integer')];
const createRules = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('valid email required'),
  body('position').optional().isString(),
  body('salary').optional().isFloat({ min: 0 })
];
const updateRules = [
  body('name').optional().trim().notEmpty(),
  body('email').optional().isEmail(),
  body('position').optional().isString(),
  body('salary').optional().isFloat({ min: 0 })
];

// CRUD endpoints delegate work to the controller while wiring in validation middleware.
r.get('/', c.list);
r.get('/:id', validateId, c.getById);
r.post('/', createRules, c.createOne);
r.put('/:id', [...validateId, ...updateRules], c.updateOne);
r.delete('/:id', validateId, c.deleteOne);

export default r;
