require('dotenv').config({ path: './.env' });
const fs = require('fs');
const bcrypt = require('bcrypt');

async function check() {
  const hash = '$2b$10$KcwVP6rde.UpQdkO6UPcMeoGyu/4IitioKFpi.yth/4lkRSeFobde';
  const tests = ['password', 'admin', '123456', 'super_admin', 'Password123'];
  const results = {};
  for (const pwd of tests) {
    results[pwd] = await bcrypt.compare(pwd, hash);
  }
  fs.writeFileSync('pwd_debug.txt', JSON.stringify(results, null, 2));
}

check();
