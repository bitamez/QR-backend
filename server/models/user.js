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
    // Case-insensitive search for users/managers
    let { data } = await supabase.from('users').select('*').ilike('email', identifier).single();
    
    if (!data) {
      // Try name case-insensitively
      const res = await supabase.from('users').select('*').ilike('name', identifier).single();
      data = res.data;
    }

    if (!data) return null;

    // Manual role lookup
    if (data.role_id) {
       const { data: roleData } = await supabase.from('roles').select('role_name').eq('role_id', data.role_id).single();
       data.role_name = roleData ? roleData.role_name : 'user';
    }

    return data;
  }
}
module.exports = User;
