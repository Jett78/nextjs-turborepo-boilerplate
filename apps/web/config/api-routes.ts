const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/auth`,
  BLOG: `${API_BASE_URL}/blogs`,
  COMPANY_PROFILE: `${API_BASE_URL}/company-profile`,
  TESTIMONIAL: `${API_BASE_URL}/testimonials`,
} as const;
