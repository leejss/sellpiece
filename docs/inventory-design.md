# 사이즈별 재고 관리 설계

## 1. 데이터베이스 스키마

### 권장 설계: product_variants 테이블

```sql
-- 상품 변형 테이블
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size VARCHAR(50),
  color VARCHAR(50),
  sku VARCHAR(100) UNIQUE,
  stock INTEGER NOT NULL DEFAULT 0,
  price_adjustment DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- 인덱스
  INDEX idx_product_variants_product_id ON product_variants(product_id),
  INDEX idx_product_variants_size ON product_variants(product_id, size),
  UNIQUE INDEX idx_product_variants_unique ON product_variants(product_id, size, color)
);
```

## 2. Drizzle ORM 스키마

```typescript
// src/lib/db/schema.ts에 추가
export const productVariants = pgTable(
  'product_variants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    size: varchar('size', { length: 50 }),
    color: varchar('color', { length: 50 }),
    sku: varchar('sku', { length: 100 }),
    stock: integer('stock').notNull().default(0),
    priceAdjustment: numeric('price_adjustment', { precision: 10, scale: 2 }).default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('product_variants_product_idx').on(table.productId),
    index('product_variants_size_idx').on(table.productId, table.size),
    uniqueIndex('product_variants_unique_idx').on(table.productId, table.size, table.color),
    uniqueIndex('product_variants_sku_unique').on(table.sku),
  ],
);

// Relations 추가
export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

// products 관계에 variants 추가
export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  images: many(productImages),
  variants: many(productVariants), // 추가
}));
```

## 3. 서비스 레이어 설계

### 재고 확인 서비스
```typescript
// src/lib/services/storefront/inventory.service.ts
export class InventoryService {
  // 특정 사이즈 재고 확인
  static async checkStock(productId: string, size: string): Promise<number> {
    const variant = await db
      .select({ stock: productVariants.stock })
      .from(productVariants)
      .where(
        and(
          eq(productVariants.productId, productId),
          eq(productVariants.size, size),
          eq(productVariants.isActive, true)
        )
      )
      .limit(1);
    
    return variant[0]?.stock || 0;
  }

  // 재고 차감
  static async decreaseStock(productId: string, size: string, quantity: number): Promise<boolean> {
    const result = await db
      .update(productVariants)
      .set({ 
        stock: sql`${productVariants.stock} - ${quantity}`,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(productVariants.productId, productId),
          eq(productVariants.size, size),
          eq(productVariants.isActive, true),
          gte(productVariants.stock, quantity) // 재고 충분한지 확인
        )
      );
    
    return result.rowCount > 0;
  }

  // 상품의 모든 사이즈 재고 조회
  static async getProductStock(productId: string): Promise<Record<string, number>> {
    const variants = await db
      .select({ size: productVariants.size, stock: productVariants.stock })
      .from(productVariants)
      .where(
        and(
          eq(productVariants.productId, productId),
          eq(productVariants.isActive, true)
        )
      );
    
    return variants.reduce((acc, variant) => {
      if (variant.size) {
        acc[variant.size] = variant.stock;
      }
      return acc;
    }, {} as Record<string, number>);
  }
}
```

### 카트 액션 업데이트
```typescript
// src/actions/storefront/cart.ts 업데이트
export async function addToCart(formData: FormData) {
  const productId = formData.get('productId') as string;
  const size = formData.get('size') as string;
  const quantity = parseInt(formData.get('quantity') as string) || 1;

  // 재고 확인
  const availableStock = await InventoryService.checkStock(productId, size);
  if (availableStock < quantity) {
    throw new Error(`Insufficient stock. Available: ${availableStock}`);
  }

  // 기존 카트 로직...
  // 재고 차감
  const success = await InventoryService.decreaseStock(productId, size, quantity);
  if (!success) {
    throw new Error('Failed to update inventory');
  }
}
```

## 4. 프론트엔드 업데이트

### 사이즈별 재고 표시 컴포넌트
```typescript
// src/components/storefront/size-selector-with-stock.tsx
type SizeSelectorWithStockProps = {
  productId: string;
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
  stockData: Record<string, number>;
};

export function SizeSelectorWithStock({ 
  productId, 
  selectedSize, 
  onSizeChange, 
  stockData 
}: SizeSelectorWithStockProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs tracking-wider text-gray-500 uppercase">Size</legend>
      <div className="flex gap-2">
        {SIZES.map((size) => {
          const stock = stockData[size] || 0;
          const isOutOfStock = stock === 0;
          
          return (
            <label 
              key={size} 
              className={`inline-flex items-center gap-2 ${
                isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <input 
                type="radio" 
                name="size" 
                value={size} 
                checked={selectedSize === size}
                onChange={() => !isOutOfStock && onSizeChange(size)}
                disabled={isOutOfStock}
                className="h-4 w-4 border-gray-300" 
              />
              <span className="text-sm">
                {size}
                {isOutOfStock && <span className="text-red-500 ml-1">(품절)</span>}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
```

## 5. 마이그레이션 전략

### 단계별 마이그레이션
1. **1단계**: product_variants 테이블 생성
2. **2단계**: 기존 상품 데이터를 variants로 변환
3. **3단계**: 프론트엔드 업데이트
4. **4단계**: 기존 products.stock 컬럼 제거 (선택사항)

### 데이터 변환 스크립트
```typescript
// scripts/migrate-to-variants.ts
async function migrateProductStock() {
  const products = await db.select().from(products);
  
  for (const product of products) {
    // 기본 사이즈들에 대해 variants 생성
    const sizes = ['S', 'M', 'L'];
    
    for (const size of sizes) {
      await db.insert(productVariants).values({
        productId: product.id,
        size,
        stock: Math.floor(product.stock / sizes.length), // 재고 분배
        sku: `${product.sku}-${size}`,
      });
    }
  }
}
```

## 6. 성능 최적화

### 캐싱 전략
```typescript
// Redis 캐싱 예시
export class CachedInventoryService {
  private static cache = new Map<string, { stock: number; timestamp: number }>();
  private static CACHE_TTL = 5 * 60 * 1000; // 5분

  static async getStock(productId: string, size: string): Promise<number> {
    const key = `${productId}-${size}`;
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.stock;
    }
    
    const stock = await InventoryService.checkStock(productId, size);
    this.cache.set(key, { stock, timestamp: Date.now() });
    
    return stock;
  }
}
```

## 7. 모니터링 및 알림

### 재고 부족 알림
```typescript
// src/lib/services/admin/inventory-alerts.service.ts
export class InventoryAlertService {
  static async checkLowStock(threshold: number = 10) {
    const lowStockVariants = await db
      .select({
        productId: productVariants.productId,
        size: productVariants.size,
        stock: productVariants.stock,
        productName: products.name,
      })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(
        and(
          eq(productVariants.isActive, true),
          lte(productVariants.stock, threshold)
        )
      );
    
    // 관리자에게 알림 전송
    await this.sendLowStockAlert(lowStockVariants);
  }
}
```

이 설계는 확장성, 성능, 유지보수성을 모두 고려한 종합적인 솔루션입니다.
