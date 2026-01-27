// Test script untuk debug DATABASE_URL dan koneksi database
import "dotenv/config";
import { Pool } from "pg";

console.log("=== DATABASE_URL DEBUG ===");
console.log("Raw process.env.DATABASE_URL:", process.env.DATABASE_URL);
console.log("DATABASE_URL type:", typeof process.env.DATABASE_URL);
console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length);

// Tampilkan karakter tersembunyi jika ada
if (process.env.DATABASE_URL) {
    console.log("DATABASE_URL as char codes:", [...process.env.DATABASE_URL].map(c => c.charCodeAt(0)));
}

console.log("\n=== CONNECTION TEST ===");

async function testConnection() {
    if (!process.env.DATABASE_URL) {
        console.error("DATABASE_URL not found in environment variables");
        return;
    }

    const pool = new Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: false // Pastikan SSL disabled untuk local development
    });

    try {
        console.log("Attempting database connection...");
        const client = await pool.connect();
        
        const result = await client.query("SELECT current_user, current_database(), version()");
        console.log("✅ Connection successful!");
        console.log("Current user:", result.rows[0].current_user);
        console.log("Current database:", result.rows[0].current_database);
        console.log("PostgreSQL version:", result.rows[0].version.substring(0, 50) + "...");
        
        client.release();
    } catch (error) {
        console.error("❌ Connection failed:");
        console.error("Error code:", error.code);
        console.error("Error message:", error.message);
        console.error("Full error:", error);
    } finally {
        await pool.end();
    }
}

testConnection();