const fetch = global.fetch || require('node-fetch');

const API = process.env.API_URL || 'http://localhost:5000/api';

async function createUser(user) {
  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    const data = await res.json();
    console.log(`Created ${user.email}:`, data);
  } catch (err) {
    console.error(`Error creating ${user.email}:`, err.message);
  }
}

async function run() {
  console.log('Seeding users...');

  await createUser({ name: 'Admin User', email: 'admin@dev', password: 'password', isAdmin: true });
  await createUser({ name: 'Normal User', email: 'user@dev', password: 'password' });

  console.log('Seed complete.');
}

run();
