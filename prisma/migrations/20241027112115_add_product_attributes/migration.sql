-- CreateTable
CREATE TABLE "attribute" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "attribute_value_id" INTEGER NOT NULL,

    CONSTRAINT "attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attribute_value" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "attribute_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "product_id" INTEGER NOT NULL,
    "attribute_value_id" INTEGER NOT NULL,

    CONSTRAINT "product_attribute_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "attribute" ADD CONSTRAINT "attribute_attribute_value_id_fkey" FOREIGN KEY ("attribute_value_id") REFERENCES "attribute_value"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute" ADD CONSTRAINT "product_attribute_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_attribute" ADD CONSTRAINT "product_attribute_attribute_value_id_fkey" FOREIGN KEY ("attribute_value_id") REFERENCES "attribute_value"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
