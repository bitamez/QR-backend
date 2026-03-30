const Service = require('../models/service');

const getServices = async (req, res, next) => {
  try {
    const services = await Service.findAll();
    res.json(services);
  } catch (err) {
    next(err);
  }
};

const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

module.exports = { getServices, createService };
