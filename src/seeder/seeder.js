"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const prisma = new client_1.PrismaClient();
async function seed() {
    const brands = await Promise.all(Array.from({ length: 5 }).map(() => {
        return prisma.brand.create({
            data: {
                name: faker_1.faker.company.name(),
                slug: faker_1.faker.lorem.slug() + '-' + faker_1.faker.string.uuid(),
                image: 'public/assets/images/brand.png',
            },
        });
    }));
    const categories = await Promise.all(Array.from({ length: 3 }).map(async () => {
        const category = await prisma.category.create({
            data: {
                name: faker_1.faker.commerce.department(),
                slug: faker_1.faker.lorem.slug() + '-' + faker_1.faker.string.uuid(),
                image: 'public/assets/images/category.png',
            },
        });
        const subcategories = await Promise.all(Array.from({ length: 2 }).map(() => {
            return prisma.subcategory.create({
                data: {
                    name: faker_1.faker.commerce.productAdjective(),
                    slug: faker_1.faker.lorem.slug() + '-' + faker_1.faker.string.uuid(),
                    image: 'public/assets/images/subcategory.png',
                    categoryId: category.id,
                },
            });
        }));
        return { category, subcategories };
    }));
    const products = await Promise.all(Array.from({ length: 10 }).map(() => {
        const category = faker_1.faker.helpers.arrayElement(categories);
        const subcategory = faker_1.faker.helpers.arrayElement(category.subcategories);
        const brand = faker_1.faker.helpers.arrayElement(brands);
        return prisma.product.create({
            data: {
                name: faker_1.faker.commerce.productName(),
                slug: faker_1.faker.lorem.slug(),
                description: faker_1.faker.commerce.productDescription(),
                price: faker_1.faker.number.int({ min: 1000, max: 10000 }),
                images: ['public/assets/images/product.png'],
                categoryId: category.category.id,
                subcategoryId: subcategory.id,
                brandId: brand.id,
            },
        });
    }));
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
//# sourceMappingURL=seeder.js.map