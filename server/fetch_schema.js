require('dotenv').config({ path: './.env' });
const fs = require('fs');
const supabase = require('./config/db');

async function test() {
  const { data, error } = await supabase.from('feedbacks').insert([{ 
    qr_code_id: 1, 
    rating: 5,
    comment: 'test'
  }]);
  
  if (error) {
    fs.writeFileSync('schema.txt', error.message);
  } else {
    fs.writeFileSync('schema.txt', 'SUCCESS');
  }
}

test();
