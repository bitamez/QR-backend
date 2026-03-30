const supabase = require('../config/db');

const getRoles = async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('role_name', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createRole = async (req, res, next) => {
  try {
    const { role_name, description } = req.body;
    const { data, error } = await supabase
      .from('roles')
      .insert([{ role_name, description }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getRoles, createRole };
