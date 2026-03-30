require('dotenv').config({ path: './server/.env' });
const Feedback = require('./server/models/feedback');

async function test() {
  try {
    const feedback = await Feedback.create({
      qr_id: 1,
      rating: 5,
      comments: 'Test',
      user_email: 'test@test.com',
      user_name: 'test',
      user_phone: '123',
      device_hash: '123'
    });
    console.log('Success:', feedback);
  } catch (err) {
    console.error('Error recording feedback:', err.message);
  }
}

test();
