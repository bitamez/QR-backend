require('dotenv').config({ path: './.env' });
const fs = require('fs');
const supabase = require('./config/db');

async function check() {
  const { data: admins, error: ae } = await supabase.from('admins').select('admin_id, username, email, role, password_hash').limit(5);
  const { data: users, error: ue } = await supabase.from('users').select('user_id, name, email, role_id, password_hash').limit(5);
  
  const out = {
    admins: ae ? ae.message : admins,
    users: ue ? ue.message : users
  };
  fs.writeFileSync('login_debug.txt', JSON.stringify(out, null, 2));
}

check();
