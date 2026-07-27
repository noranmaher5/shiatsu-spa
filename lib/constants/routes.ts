/** Public site routes (rendered under the [locale] segment). */
export const PUBLIC_ROUTES = {
  home: "/",
  about: "/about",
  services: "/services",
  serviceDetail: (slug: string) => `/services/${slug}`,
  branches: "/branches",
  gallery: "/gallery",
  contact: "/contact",
} as const;

/** Admin dashboard routes (not locale-prefixed). */
export const ADMIN_ROUTES = {
  login: "/admin/login",
  dashboard: "/admin/dashboard",
  services: "/admin/services",
  newService: "/admin/services/new",
  editService: (id: string) => `/admin/services/${id}`,
  categories: "/admin/categories",
  gallery: "/admin/gallery",
  testimonials: "/admin/testimonials",
  branches: "/admin/branches",
  settings: "/admin/settings",
} as const;
