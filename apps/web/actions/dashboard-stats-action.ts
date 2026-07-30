"use server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function getDashboardStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      next: { tags: ["dashboard-stats"] },
    });
    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
}