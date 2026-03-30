require('dotenv').config({ path: './.env' });
const fs = require('fs');
const Feedback = require('./models/feedback');

async function test() {
  try {
    const feedback = await Feedback.create({
      qr_id: 1,
      rating: 5,
      comments: 'Test 2',
      user_email: 'test@test.com',
      device_hash: 'new_hash'
    });
    fs.writeFileSync('error.txt', 'SUCCESS');
  } catch (err) {
    fs.writeFileSync('error.txt', err.message);
  }
}

test();
