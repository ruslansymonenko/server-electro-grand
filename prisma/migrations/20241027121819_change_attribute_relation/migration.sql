/*
  Warnings:

  - You are about to drop the column `attribute_value_id` on the `attribute` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "attribute" DROP CONSTRAINT "attribute_attribute_value_id_fkey";

-- AlterTable
ALTER TABLE "attribute" DROP COLUMN "attribute_value_id";

-- AlterTable
ALTER TABLE "attribute_value" ADD COLUMN     "attribute_id" INTEGER;

-- AddForeignKey
ALTER TABLE "attribute_value" ADD CONSTRAINT "attribute_value_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "attribute"("id") ON DELETE SET NULL ON UPDATE CASCADE;
