-- DropForeignKey
ALTER TABLE "attribute" DROP CONSTRAINT "attribute_attribute_value_id_fkey";

-- AlterTable
ALTER TABLE "attribute" ALTER COLUMN "attribute_value_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attribute" ADD CONSTRAINT "attribute_attribute_value_id_fkey" FOREIGN KEY ("attribute_value_id") REFERENCES "attribute_value"("id") ON DELETE SET NULL ON UPDATE CASCADE;
