const Branch = require('../models/branch');

const getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.findAll();
    res.json(branches);
  } catch (err) {
    next(err);
  }
};

const createBranch = async (req, res, next) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (err) {
    next(err);
  }
};

module.exports = { getBranches, createBranch };
