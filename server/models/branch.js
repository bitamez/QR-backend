const supabase = require('../config/db');

class Branch {
  static async count() {
    const { count, error } = await supabase.from('branches').select('*', { count: 'exact', head: true });
    if (error) throw new Error(error.message);
    return count || 0;
  }
  static async findAll() {
    const { data, error } = await supabase.from('branches').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  }
  static async findById(id) {
    const { data, error } = await supabase.from('branches').select('*').eq('branch_id', id).single();
    if (error) throw new Error(error.message);
    return data;
  }
  static async create(data) {
    const { organization_id, name, address, latitude, longitude } = data;
    const { data: branch, error } = await supabase.from('branches').insert([{ organization_id, name, address, latitude, longitude }]).select().single();
    if (error) throw new Error(error.message);
    return branch;
  }
}
module.exports = Branch;
