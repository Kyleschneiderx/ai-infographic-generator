/**
 * IN-MEMORY USER STORE — FOR LOCAL DEVELOPMENT ONLY
 *
 * This Map is wiped on every server restart and is NOT shared across
 * serverless function instances. Before any real/production use, replace
 * this with a persistent database (Supabase, PlanetScale, MongoDB Atlas,
 * Postgres, etc.) with a unique constraint on the `email` field.
 */

if (process.env.NODE_ENV === "production") {
  console.error(
    "\n" +
    "╔══════════════════════════════════════════════════════════════╗\n" +
    "║  ⚠  CRITICAL: IN-MEMORY USER STORE ACTIVE IN PRODUCTION  ⚠  ║\n" +
    "║                                                              ║\n" +
    "║  All user accounts are stored in a JavaScript Map that is   ║\n" +
    "║  wiped on every server restart and is NOT shared across     ║\n" +
    "║  serverless function instances. Users WILL lose access and  ║\n" +
    "║  this is NOT safe for real use.                             ║\n" +
    "║                                                              ║\n" +
    "║  Replace lib/users.ts with a real database before shipping. ║\n" +
    "╚══════════════════════════════════════════════════════════════╝\n"
  );
} else {
  console.warn(
    "[auth] Using in-memory user store (lib/users.ts). " +
    "All accounts are wiped on server restart. " +
    "Replace with a real database before production use."
  );
}

export interface User {
  name: string;
  email: string;
  passwordHash: string;
}

const users = new Map<string, User>();

export function findUserByEmail(email: string): User | undefined {
  return users.get(email.toLowerCase());
}

export function createUser(user: User): void {
  users.set(user.email.toLowerCase(), user);
}

export function userExists(email: string): boolean {
  return users.has(email.toLowerCase());
}
