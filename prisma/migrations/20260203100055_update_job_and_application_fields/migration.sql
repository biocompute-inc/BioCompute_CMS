/*
  Warnings:

  - You are about to drop the column `name` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `resumeUrl` on the `Application` table. All the data in the column will be lost.
  - Added the required column `fullName` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkedIn` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `howToApply` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whoWeAreLookingFor` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable Job - Add new columns with defaults
ALTER TABLE "Job" 
ADD COLUMN "howToApply" TEXT NOT NULL DEFAULT 'Please submit your application through our portal.',
ADD COLUMN "whoWeAreLookingFor" TEXT NOT NULL DEFAULT 'We are looking for qualified candidates.';

-- Remove defaults after adding columns
ALTER TABLE "Job" 
ALTER COLUMN "howToApply" DROP DEFAULT,
ALTER COLUMN "whoWeAreLookingFor" DROP DEFAULT;

-- AlterTable Application - Drop old columns and add new ones
ALTER TABLE "Application" 
DROP COLUMN "name",
DROP COLUMN "resumeUrl",
ADD COLUMN "coverLetter" TEXT,
ADD COLUMN "fullName" TEXT NOT NULL DEFAULT '',
ADD COLUMN "linkedIn" TEXT NOT NULL DEFAULT '',
ADD COLUMN "phone" TEXT NOT NULL DEFAULT '',
ADD COLUMN "resume" TEXT NOT NULL DEFAULT '';

-- Remove defaults after adding columns
ALTER TABLE "Application" 
ALTER COLUMN "fullName" DROP DEFAULT,
ALTER COLUMN "linkedIn" DROP DEFAULT,
ALTER COLUMN "phone" DROP DEFAULT,
ALTER COLUMN "resume" DROP DEFAULT;
