import { validationResult } from 'express-validator';
import db from '../../models/index.js';
const { Employee } = db;

// Collects validation errors from express-validator middleware and normalises the failure shape.
function assertValid(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error(errors.array().map(e => e.msg).join(', '));
    err.status = 400;
    throw err;
  }
}

// GET /employees -> return every employee ordered by id for stable listings.
export async function list(_req, res, next) {
  try {
    const employees = await Employee.findAll({ order: [['id', 'ASC']] });
    res.json(employees);
  } catch (e) { next(e); }
}

// GET /employees/:id -> fetch a single employee by primary key.
export async function getById(req, res, next) {
  try {
    assertValid(req);
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    res.json(emp);
  } catch (e) { next(e); }
}

// POST /employees -> create a new record using request body fields.
export async function createOne(req, res, next) {
  try {
    assertValid(req);
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError') {
      e.status = 400; e.message = 'Email must be unique';
    }
    next(e);
  }
}

// PUT /employees/:id -> apply partial updates and return the updated entity.
export async function updateOne(req, res, next) {
  try {
    assertValid(req);
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    await emp.update(req.body);
    res.json(emp);
  } catch (e) { next(e); }
}

// DELETE /employees/:id -> remove the employee after confirming existence.
export async function deleteOne(req, res, next) {
  try {
    assertValid(req);
    const emp = await Employee.findByPk(req.params.id);
    if (!emp) return res.status(404).json({ message: 'Employee not found' });
    await emp.destroy();
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
}
