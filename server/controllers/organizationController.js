const Organization = require('../models/organization');

const getOrganizations = async (req, res, next) => {
  try {
    const orgs = await Organization.findAll();
    res.json(orgs);
  } catch (err) {
    next(err);
  }
};

const createOrganization = async (req, res, next) => {
  try {
    const org = await Organization.create(req.body);
    res.status(201).json(org);
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrganizations, createOrganization };
