-- AlterTable
ALTER TABLE "CalendarEvent" ADD COLUMN     "currentAttendees" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxAttendees" INTEGER NOT NULL DEFAULT 20;
