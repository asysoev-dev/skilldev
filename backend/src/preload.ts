import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  const result = dotenv.config({ path: path.resolve(__dirname, '../../.env.dev') });
  if (result.error) {
    console.warn('No .env.dev file found, using system environment variables');
  } else {
    console.log('Environment loaded from .env.dev');
  }
}