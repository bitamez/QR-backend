const supabase = require('../config/db');

class User {
  static async findAdminByUsername(identifier) {
    // Case-insensitive search for admins
    let { data } = await supabase.from('admins').select('*').ilike('username', identifier).single();
    if (!data) {
      const res = await supabase.from('admins').select('*').ilike('email', identifier).single();
      data = res.data;
    }
    return data;
  }

  static async findUserByEmailOrName(identifier) {
    // Search with role join
    const { data, error } = await supabase
      .from('users')
      .select('*, roles:role_id(role_name)')
      .or(`email.ilike.${identifier},name.ilike.${identifier}`)
      .single();
    
    if (error || !data) return null;

    // Flatten role_name for easier use
    data.role_name = data.roles?.role_name || 'user';
    return data;
  }
}
module.exports = User;
