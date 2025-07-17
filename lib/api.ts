import axios from "axios";
import type {
  User,
  LoginResponse,
  Conversation,
  Message,
  Customer,
} from "@/types";

// Create axios instance with interceptors
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_REACT_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        try {
          // Attempt to refresh token
          const response = await axios.post("/api/auth/refresh", {
            refreshToken,
          });
          const newToken = response.data.token;
          localStorage.setItem("auth_token", newToken);

          // Retry original request
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axios.request(error.config);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          // localStorage.removeItem("auth_token");
          // localStorage.removeItem("refresh_token");
          // window.location.href = "/login";
        }
      } else {
        // localStorage.removeItem("auth_token");
        // window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Mock data for development
const mockUsers: User[] = [
  {
    id: "1",
    username: "admin",
    fullName: "Administrator",
    avt: "",
    permissions: ["chat", "kd", "permission", "customer_type"],
    customer_types: ["cn", "dn", "hkd", "dt"],
    dateOfBirth: "1990-01-01",
    gender: "male",
    address: "Ho Chi Minh City, Vietnam",
    settings: {},
  },
  {
    id: "2",
    username: "reviewer1",
    fullName: "John Reviewer",
    avt: "",
    permissions: ["chat"],
    customer_types: ["cn", "dn"],
    dateOfBirth: "1985-05-15",
    gender: "male",
    address: "Hanoi, Vietnam",
    settings: {},
  },
  {
    id: "3",
    username: "user1",
    fullName: "Jane User",
    avt: "",
    permissions: ["chat", "kd"],
    customer_types: ["cn"],
    dateOfBirth: "1992-08-20",
    gender: "female",
    address: "Da Nang, Vietnam",
    settings: {},
  },
];

const mockConversations: Conversation[] = [
  {
    id: "conv1",
    customerObject: {
      id: "cust1",
      fb_id: "fb_123456789",
      fb_name: "Nguyen Van A",
      fb_avt: "",
      customer_type: "cn",
    },
    userObject: {
      id: "1",
      username: "admin",
      fullName: "Administrator",
    },
    lastMessage: "I need help with my account balance",
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 2,
  },
  {
    id: "conv2",
    customerObject: {
      id: "cust2",
      fb_id: "fb_987654321",
      fb_name: "Tran Thi B",
      fb_avt: "",
      customer_type: "dn",
    },
    userObject: {
      id: "1",
      username: "admin",
      fullName: "Administrator",
    },
    lastMessage: "Can you help me with loan application?",
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
  },
];

const mockMessages: Message[] = [
  {
    id: "msg1",
    sender_id: "fb_123456789",
    sender_type: "user",
    content: "Hello, I need help with my account",
    conversation_id: "conv1",
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "msg2",
    sender_id: "bot",
    sender_type: "bot",
    content: "Hello! I'm here to help you. What can I assist you with today?",
    conversation_id: "conv1",
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
  },
  {
    id: "msg3",
    sender_id: "fb_123456789",
    sender_type: "user",
    content: "I need help with my account balance",
    conversation_id: "conv1",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    // Simulate API call
    const response = await api.post("/auth/login", {
      username,
      password,
    });

    return response;
  },

  getUserData: async () => {
    const response = await api.get("/users/get-info");
    return response.data.data;
  },

  updateProfileById: async (userId: string, updates: Partial<User>) => {
    const response = await api.put(`/users/${userId}/profile`, updates);
    if (response.status !== 200) {
      throw new Error("Failed to update profile");
    }
    return response.data.data;
  },

  updateProfile: async (updates: Partial<User>) => {
    const response = await api.post("/users/update-info", updates);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed to update profile");
    }
    return response.data.data;
  },
};

// User API
export const userApi = {
  getListUser: async () => {
    const response = await api.get("/users/list");
    return response.data.data.users;
  },

  setPermission: async (
    userId: string,
    permissions: string[]
  ): Promise<void> => {
    const response = await api.put(`/users/${userId}/permissions`, {
      permissions,
    });
    if (response.status !== 200) {
      throw new Error("Failed to update permissions");
    }
    return response.data;
  },

  setCustomerTypes: async (
    userId: string,
    customerTypes: string[]
  ): Promise<void> => {
    const response = await api.put(`/users/${userId}/customer-types`, {
      customerTypes: customerTypes,
    });
    if (response.status !== 200) {
      throw new Error("Failed to update customer types");
    }
    return response.data;
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
  },

  updateProfileById: async (userId: string, updates: Partial<User>) => {
    const response = await api.put(`/users/${userId}/profile`, updates);
    if (response.status !== 200) {
      throw new Error("Failed to update profile");
    }
    return response.data.data;
  },

  createUser: async (userData: Partial<User>) => {
    const response = await api.post("/users/create", userData);
    if (response.status !== 201) {
      throw new Error("Failed to create user");
    }
    return response.data.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    const response = await api.delete(`/users/${userId}`);
    if (response.status !== 200) {
      throw new Error("Failed to delete user");
    }
    return response.data;
  },
};

// Chat API
export const chatApi = {
  getListConversation: async () => {
    const response = await api.get("/conversations");
    if (response.status !== 200) {
      throw new Error("Failed to fetch conversations");
    }
    return response.data.data.conversations;
  },

  getListMessages: async (conversationId: string) => {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch messages");
    }
    return response.data.data.messages;
  },

  getProfileCustomer: async (customerId: string) => {
    const response = await api.get(`/customers/${customerId}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch customer profile");
    }
    return response.data.data;
  },

  getConversationById: async (conversationId: string) => {
    const response = await api.get(`/conversations/${conversationId}`);
    if (response.status !== 200) {
      throw new Error("Failed to fetch conversation");
    }
    return response.data.data;
  },
};
