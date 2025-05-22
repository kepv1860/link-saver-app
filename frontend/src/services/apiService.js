const API_BASE_URL = "http://localhost:5000"; // Assuming backend runs on port 5000

async function request(endpoint, method = "GET", data = null, token = null) {
  const config = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (data && (method === "POST" || method === "PUT" || method === "DELETE")) {
    config.body = JSON.stringify(data);
  }

  try {
    // Ensure all endpoints start with /api
    const fullEndpoint = endpoint.startsWith("/api") ? endpoint : `/api${endpoint}`;
    const response = await fetch(`${API_BASE_URL}${fullEndpoint}`, config);
    
    if (response.status === 204 && method === "DELETE") {
        return { message: "Resource deleted successfully" }; 
    }
    const responseData = await response.json();
    if (!response.ok) {
      console.error("API Error Response:", responseData);
      throw new Error(responseData.error || responseData.message || `HTTP error! status: ${response.status}`);
    }
    return responseData;
  } catch (error) {
    console.error(`Error during API call to ${method} ${API_BASE_URL}${endpoint}:`, error);
    throw error; 
  }
}

export const apiService = {
  // Auth
  register: (userData) => request("/register", "POST", userData),
  login: (credentials) => request("/login", "POST", credentials),
  
  // Profile
  getProfile: (userId, token) => request(`/users/${userId}/profile`, "GET", null, token),
  updateProfile: (userId, profileData, token) => request(`/users/${userId}/profile`, "PUT", profileData, token),
  
  // Links
  getLinks: (token) => request("/links", "GET", null, token),
  addLink: (linkData, token) => request("/links", "POST", linkData, token),
  updateLink: (linkId, linkData, token) => request(`/links/${linkId}`, "PUT", linkData, token),
  deleteLink: (linkId, token) => request(`/links/${linkId}`, "DELETE", null, token),

  // Goals (Placeholder)
  // getGoals: (token) => request("/goals", "GET", null, token),
  // addGoal: (goalData, token) => request("/goals", "POST", goalData, token),
  // updateGoal: (goalId, goalData, token) => request(`/goals/${goalId}`, "PUT", goalData, token),
  // deleteGoal: (goalId, token) => request(`/goals/${goalId}`, "DELETE", null, token),
  
  // AI Features (Placeholder)
  // summarizeUrl: (url, token) => request("/ai/summarize", "POST", { url }, token),
  // generateTagsForUrl: (url, token) => request("/ai/tag", "POST", { url }, token),
};

