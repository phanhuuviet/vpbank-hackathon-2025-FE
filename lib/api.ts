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
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
      } else {
        localStorage.removeItem("auth_token");
        window.location.href = "/login";
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
    dob: "1990-01-01",
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
    dob: "1985-05-15",
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
    dob: "1992-08-20",
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
  login: async (username: string, password: string): Promise<LoginResponse> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = mockUsers.find((u) => u.username === username);
    if (
      !user ||
      (password !== "password" &&
        !(username === "admin" && password === "admin123"))
    ) {
      throw new Error("Invalid credentials");
    }

    return {
      status: "success",
      message: "Login successful",
      data: {
        id: user.id,
        token: "mock-jwt-token",
        refreshToken: "mock-refresh-token",
        permissions: user.permissions,
      },
    };
  },

  getUserData: async (userId: string): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) throw new Error("User not found");
    return user;
  },

  updateProfile: async (
    userId: string,
    updates: Partial<User>
  ): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
  },
};

// User API
export const userApi = {
  getListUser: async (): Promise<User[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUsers;
  },

  setPermission: async (
    userId: string,
    permissions: string[]
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex].permissions = permissions;
    }
  },

  setCustomerTypes: async (
    userId: string,
    customerTypes: string[]
  ): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      mockUsers[userIndex].customer_types = customerTypes;
    }
  },

  updateUser: async (userId: string, updates: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    return mockUsers[userIndex];
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username || "",
      fullName: userData.fullName || "",
      avt: "",
      permissions: userData.permissions || [],
      customer_types: userData.customer_types || [],
      dob: userData.dob,
      gender: userData.gender,
      address: userData.address,
      settings: {},
    };
    mockUsers.push(newUser);
    return newUser;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const userIndex = mockUsers.findIndex((u) => u.id === userId);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
    }
  },
};

// Chat API
export const chatApi = {
  getListConversation: async (): Promise<Conversation[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockConversations;
  },

  getListMessages: async (conversationId: string): Promise<Message[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockMessages.filter((m) => m.conversation_id === conversationId);
  },

  getProfileCustomer: async (customerId: string): Promise<Customer> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const conversation = mockConversations.find(
      (c) => c.customerObject.id === customerId
    );
    if (!conversation) throw new Error("Customer not found");

    return {
      id: conversation.customerObject.id,
      fb_id: conversation.customerObject.fb_id,
      fb_name: conversation.customerObject.fb_name,
      fb_avt: conversation.customerObject.fb_avt,
      fb_dob: "1990-01-01",
      db_link: "https://database.vpbank.com/customer/" + customerId,
      customer_type: conversation.customerObject.customer_type,
    };
  },

  getConversationById: async (
    conversationId: string
  ): Promise<Conversation> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const conversation = mockConversations.find((c) => c.id === conversationId);
    if (!conversation) throw new Error("Conversation not found");
    return conversation;
  },
};
