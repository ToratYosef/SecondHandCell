const required = [
  'FIREBASE_PROJECT_ID',
  'NEXTAUTH_SECRET',
  'WHOLESALE_ADMIN_TOKEN'
];

const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`Missing environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('Environment looks good');
