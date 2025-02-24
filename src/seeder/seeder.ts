import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function seed() {
  const brands = await Promise.all(
    Array.from({ length: 5 }).map(() => {
      return prisma.brand.create({
        data: {
          name: faker.company.name(),
          slug: faker.lorem.slug() + '-' + faker.string.uuid(),
          image: 'public/assets/images/brand.png',
        },
      });
    }),
  );

  const categories = await Promise.all(
    Array.from({ length: 3 }).map(async () => {
      const category = await prisma.category.create({
        data: {
          name: faker.commerce.department(),
          slug: faker.lorem.slug() + '-' + faker.string.uuid(),
          image: 'public/assets/images/category.png',
        },
      });

      const subcategories = await Promise.all(
        Array.from({ length: 2 }).map(() => {
          return prisma.subcategory.create({
            data: {
              name: faker.commerce.productAdjective(),
              slug: faker.lorem.slug() + '-' + faker.string.uuid(),
              image: 'public/assets/images/subcategory.png',
              categoryId: category.id,
            },
          });
        }),
      );

      return { category, subcategories };
    }),
  );

  const products = await Promise.all(
    Array.from({ length: 10 }).map(() => {
      const category = faker.helpers.arrayElement(categories);
      const subcategory = faker.helpers.arrayElement(category.subcategories);
      const brand = faker.helpers.arrayElement(brands);

      return prisma.product.create({
        data: {
          name: faker.commerce.productName(),
          slug: faker.lorem.slug(),
          description: faker.commerce.productDescription(),
          price: faker.number.int({ min: 1000, max: 10000 }),
          images: ['public/assets/images/product.png'],
          categoryId: category.category.id,
          subcategoryId: subcategory.id,
          brandId: brand.id,
        },
      });
    }),
  );

  console.log(`Created ${products.length} products.`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
