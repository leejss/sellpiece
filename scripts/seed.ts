import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import { faker } from '@faker-js/faker';
import postgres from 'postgres';
import * as schema from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env file');
}

function categoryCondition(categoryName: string) {
  return eq(schema.productCategories.name, categoryName);
}

const main = async () => {
  const client = postgres(process.env.DATABASE_URL!, { max: 1 });
  const db = drizzle(client, { schema });

  console.log('🌱 Seeding database...');

  // 테스트 데이터 일관성을 위해 faker 시드 고정
  faker.seed(1234);

  try {
    await db.transaction(async (tx) => {
      const categoryName = 'Books';

      const [existingCategory] = await tx
        .select()
        .from(schema.productCategories)
        .where(categoryCondition(categoryName));

      let category = existingCategory;

      if (!category) {
        console.log(`📚 Category '${categoryName}' not found, creating it...`);
        const [createdCategory] = await tx
          .insert(schema.productCategories)
          .values({ name: categoryName, slug: 'books' })
          .returning();

        if (!createdCategory) {
          throw new Error('카테고리 생성에 실패했습니다.');
        }

        category = createdCategory;
        console.log(`👍 Created category with ID: ${category.id}`);
      } else {
        console.log(`📚 Found existing category '${categoryName}' with ID: ${category.id}`);
      }

      const productsCount = 20;
      const generatedProducts: (typeof schema.products.$inferInsert)[] = [];

      for (let i = 0; i < productsCount; i++) {
        generatedProducts.push({
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          stock: faker.number.int({ min: 0, max: 100 }),
          isPublished: true,
          status: 'active',
          categoryId: category.id,
        });
      }

      console.log(`🗑️  Deleting existing products...`);
      await tx.delete(schema.products);

      console.log(`📝 Inserting ${productsCount} new products...`);
      await tx.insert(schema.products).values(generatedProducts);
    });

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('👋 Database connection closed.');
  }
};
main();
