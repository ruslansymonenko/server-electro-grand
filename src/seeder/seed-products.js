"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function createProducts(numProducts) {
    const categories = await prisma.category.findMany({
        include: {
            subcategories: true,
        },
    });
    const brands = await prisma.brand.findMany();
    if (categories.length === 0 || brands.length === 0) {
        throw new Error('Need to create categories and brands first.');
    }
    const products = await Promise.all(Array.from({ length: numProducts }).map(async () => {
        const category = faker_1.faker.helpers.arrayElement(categories);
        const subcategory = faker_1.faker.helpers.arrayElement(category.subcategories);
        const brand = faker_1.faker.helpers.arrayElement(brands);
        return prisma.product.create({
            data: {
                name: faker_1.faker.commerce.productName(),
                slug: faker_1.faker.lorem.slug() + '-' + faker_1.faker.string.uuid(),
                description: faker_1.faker.commerce.productDescription(),
                price: faker_1.faker.number.int({ min: 1000, max: 10000 }),
                images: ['public/assets/images/product.png'],
                categoryId: category.id,
                subcategoryId: subcategory?.id || null,
                brandId: brand.id,
            },
        });
    }));
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
//# sourceMappingURL=seed-products.js.map