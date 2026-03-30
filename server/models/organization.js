const supabase = require('../config/db');

class Organization {
  static async findAll() {
    const { data, error } = await supabase.from('organizations').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }
  static async findById(id) {
    const { data, error } = await supabase.from('organizations').select('*').eq('organization_id', id).single();
    if (error) throw new Error(error.message);
    return data;
  }
  static async create(data) {
    const { name, email, phone, address, latitude, longitude } = data;
    const { data: org, error } = await supabase.from('organizations').insert([{ name, email, phone, address, latitude, longitude }]).select().single();
    if (error) throw new Error(error.message);
    return org;
  }
}

module.exports = Organization;
