const supabase = require('../config/db');

class Service {
  static async count() {
    const { count, error } = await supabase.from('services').select('*', { count: 'exact', head: true });
    if (error) throw new Error(error.message);
    return count || 0;
  }
  static async findAll() {
    const { data, error } = await supabase.from('services').select('*');
    if (error) throw new Error(error.message);
    return data || [];
  }
  static async create(data) {
    const { organization_id, name, description } = data;
    const { data: service, error } = await supabase.from('services').insert([{ organization_id, name, description }]).select().single();
    if (error) throw new Error(error.message);
    return service;
  }
}
module.exports = Service;
