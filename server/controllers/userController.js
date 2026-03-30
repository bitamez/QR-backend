const User = require('../models/user');
const bcrypt = require('bcrypt');
const supabase = require('../config/db');

const getUsers = async (req, res, next) => {
  try {
    // Basic fetch of users
    const { data: usersData, error } = await supabase.from('users').select('*');
    if (error) throw new Error(usersError.message);

    // Fetch roles and orgs separately to avoid relationship issue
    const { data: rolesData } = await supabase.from('roles').select('*');
    const { data: orgsData } = await supabase.from('organizations').select('*');

    const flattened = usersData.map(u => {
      const role = rolesData?.find(r => r.role_id === u.role_id);
      const org = orgsData?.find(o => o.organization_id === u.organization_id);
      return {
        user_id: u.user_id,
        full_name: u.name,
        email: u.email,
        phone: u.phone,
        org_name: org?.name || 'N/A',
        role_name: role?.role_name || 'user'
      };
    });

    res.json(flattened);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { organization_id, full_name, email, phone, role } = req.body;
    const defaultPassword = await bcrypt.hash('password123', 10);
    
    // In search of role_id
    const { data: roleData } = await supabase.from('roles').select('role_id').eq('role_name', role || 'coordinator').single();

    const { data: user, error } = await supabase
      .from('users')
      .insert([{ organization_id, name: full_name, email, phone, password_hash: defaultPassword, role_id: roleData?.role_id }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    let data, error;

    if (role === 'super_admin') {
      ({ data, error } = await supabase.from('admins').select('admin_id, username, email, role').eq('admin_id', id).single());
    } else {
      ({ data, error } = await supabase.from('users').select('user_id, name, email, phone').eq('user_id', id).single());
    }

    if (error) throw new Error(error.message);
    
    // Transform 'name' back to 'full_name' for frontend compatibility if needed
    if (data && data.name) {
      data.full_name = data.name;
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    const { username, full_name, email, phone } = req.body;
    let data, error;

    if (role === 'super_admin') {
      ({ data, error } = await supabase.from('admins').update({ username, email }).eq('admin_id', id).select().single());
    } else {
      ({ data, error } = await supabase.from('users').update({ name: full_name, email, phone }).eq('user_id', id).select().single());
    }

    if (error) throw new Error(error.message);
    res.json({ message: 'Profile updated successfully', user: data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, createUser, getProfile, updateProfile };
