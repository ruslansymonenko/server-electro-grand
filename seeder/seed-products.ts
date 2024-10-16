import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createProducts(numProducts: number) {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: true,
    },
  });
  const brands = await prisma.brand.findMany();

  if (categories.length === 0 || brands.length === 0) {
    throw new Error('Need to create categories and brands first.');
  }

  const products = await Promise.all(
    Array.from({ length: numProducts }).map(async () => {
      const category = faker.helpers.arrayElement(categories);
      const subcategory = faker.helpers.arrayElement(category.subcategories);
      const brand = faker.helpers.arrayElement(brands);

      return prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          slug: faker.lorem.slug() + '-' + faker.string.uuid(),
          description: faker.commerce.productDescription(),
          price: faker.number.int({ min: 1000, max: 10000 }),
          images: ['public/assets/images/product.png'],
          categoryId: category.id,
          subcategoryId: subcategory?.id || null,
          brandId: brand.id,
        },
      });
    }),
  );

  console.log(`Created ${products.length} products.`);
  return products;
}

createProducts(10)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
