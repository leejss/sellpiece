export type NavItem = {
  href: string;
  label: string;
  disabled?: boolean;
};

export const adminNavItems: NavItem[] = [
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/products/categories', label: 'Categories' },
  // { href: "/admin/orders", label: "Orders", disabled: true },
  // { href: "/admin/settings", label: "Settings", disabled: true },
];
