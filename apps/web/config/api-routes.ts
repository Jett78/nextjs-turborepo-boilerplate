const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/auth`,
  AUTH_PROFILE: `${API_BASE_URL}/auth/profile`,
  USER: `${API_BASE_URL}/auth/users`,
  BLOG: `${API_BASE_URL}/blogs`,
  COMPANY_PROFILE: `${API_BASE_URL}/company-profile`,
  TESTIMONIAL: `${API_BASE_URL}/testimonials`,
  INQUIRY: `${API_BASE_URL}/inquiries`,
  SEO: `${API_BASE_URL}/seo`,
  PAGE_SEO: `${API_BASE_URL}/page-seo`,
  FAQ: `${API_BASE_URL}/faqs`,
  DASHBOARD_STATS: `${API_BASE_URL}/dashboard/stats`,
  PAYMENT_SETTINGS: `${API_BASE_URL}/payment-settings`,
  KHALTI: `${API_BASE_URL}/khalti`,
  KHALTI_ORDER: `${API_BASE_URL}/khalti/order`,
  DOMAIN: `${API_BASE_URL}/domains`,
  TEAM: `${API_BASE_URL}/team-members`,
} as const;
