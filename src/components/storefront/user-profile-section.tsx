'use client';

/**
 * Yeezy 스타일의 사용자 프로필 섹션
 * 주문 주소, 결제 정보 등을 표시
 */
export function UserProfileSection() {
  return (
    <div className="space-y-8">
      {/* Shipping Address */}
      <section>
        <h2 className="mb-4 text-xs tracking-wider text-gray-500 uppercase">Shipping Address</h2>
        <div className="space-y-2 text-sm">
          <p className="font-medium">John Doe</p>
          <p className="text-gray-600">123 Main Street</p>
          <p className="text-gray-600">Apt 4B</p>
          <p className="text-gray-600">New York, NY 10001</p>
          <p className="text-gray-600">United States</p>
        </div>
        <button className="mt-4 text-xs tracking-wider uppercase underline hover:no-underline">
          Edit Address
        </button>
      </section>

      {/* Payment Method */}
      <section>
        <h2 className="mb-4 text-xs tracking-wider text-gray-500 uppercase">Payment Method</h2>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Visa ending in 4242</p>
          <p className="text-gray-600">Expires 12/25</p>
        </div>
        <button className="mt-4 text-xs tracking-wider uppercase underline hover:no-underline">
          Edit Payment
        </button>
      </section>

      {/* Contact Info */}
      <section>
        <h2 className="mb-4 text-xs tracking-wider text-gray-500 uppercase">Contact</h2>
        <div className="space-y-2 text-sm">
          <p className="text-gray-600">john.doe@example.com</p>
          <p className="text-gray-600">+1 (555) 123-4567</p>
        </div>
        <button className="mt-4 text-xs tracking-wider uppercase underline hover:no-underline">
          Edit Contact
        </button>
      </section>
    </div>
  );
}
