import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadEnvVars() {
  try {
    const envPath = join(__dirname, '.env');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });
    
    return envVars;
  } catch (err) {
    console.error('Error loading .env file:', err);
    process.exit(1);
  }
}

const env = loadEnvVars();

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function populateDatabase() {
  try {
    const { data: testData, error: testError } = await supabase.from('profiles').select('count');
    
    if (testError) {
      throw new Error(`Database connection test failed: ${testError.message}`);
    }
    
    console.log('Database connection successful');
    
    const { populateDummyData } = await import('./src/utils/supabase-dummy-data.js');
    await populateDummyData(supabase);
    
    console.log('Database population completed successfully');
  } catch (error) {
    console.error('Error during database population:', error);
    process.exit(1);
  }
}

populateDatabase();
