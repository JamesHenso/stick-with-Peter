-- Fix typos drifted from hand-edited schema.prisma (no code ever used the old names):
-- 1. tasks.pritority -> tasks.priority
-- 2. TaskPriority.HARD -> TaskPriority.HIGH (matches zod schemas)
-- 3. Drop notes.isDue (not in schema, unused, table empty)

ALTER TYPE "TaskPriority" RENAME VALUE 'HARD' TO 'HIGH';

ALTER TABLE "tasks" RENAME COLUMN "pritority" TO "priority";

ALTER TABLE "notes" DROP COLUMN "isDue";
