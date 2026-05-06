import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Initialize a connection pool with your Neon URL
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });

// Wrap the pool in Prisma's Postgres adapter
const adapter = new PrismaPg(pool);

// Pass the adapter to PrismaClient
export const prisma = new PrismaClient({ adapter });