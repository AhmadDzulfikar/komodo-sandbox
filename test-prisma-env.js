// Test Prisma Environment Loading
import "dotenv/config";

console.log("=== PRISMA V7 ENVIRONMENT DEBUG ===");

// Cek semua environment variables
console.log("\n1. All environment variables containing 'DATABASE':");
Object.keys(process.env)
  .filter(key => key.includes('DATABASE'))
  .forEach(key => console.log(`${key}=${process.env[key]}`));

console.log("\n2. NODE_ENV:", process.env.NODE_ENV || 'undefined');
console.log("3. PWD:", process.cwd());

// Test Prisma config loading
console.log("\n4. Testing Prisma config loading...");
try {
    // Import Prisma config
    const configModule = await import('./prisma.config.ts');
    console.log("✅ Prisma config loaded successfully");
    console.log("Config:", configModule.default);
} catch (error) {
    console.error("❌ Failed to load Prisma config:", error.message);
}

// Test dotenv loading explicitly
console.log("\n5. Testing dotenv loading...");
import { config } from 'dotenv';
const result = config();
console.log("Dotenv result:", result);
console.log("DATABASE_URL after explicit dotenv:", process.env.DATABASE_URL);

// Test with different connection methods
console.log("\n6. Testing different connection string formats...");
const testUrls = [
    process.env.DATABASE_URL,
    "postgresql://dev:devpass@127.0.0.1:5432/komodo_dev?schema=public",
    "postgresql://dev:devpass@localhost:5432/komodo_dev?schema=public&sslmode=disable",
    "postgresql://dev:devpass@host.docker.internal:5432/komodo_dev?schema=public"
];

for (let i = 0; i < testUrls.length; i++) {
    const url = testUrls[i];
    if (!url) continue;
    
    console.log(`\nTest ${i + 1}: ${url.substring(0, 50)}...`);
    
    try {
        const { Pool } = await import('pg');
        const pool = new Pool({ 
            connectionString: url,
            ssl: false
        });
        
        const client = await pool.connect();
        const result = await client.query("SELECT current_user, current_database()");
        console.log(`✅ Success: ${result.rows[0].current_user}@${result.rows[0].current_database}`);
        
        client.release();
        await pool.end();
    } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
    }
}