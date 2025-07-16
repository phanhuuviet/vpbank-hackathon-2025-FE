export interface User {
  id: string;
  email?: string;
  username: string;
  fullName: string;
  avt: string;
  permissions: string[];
  customer_types: string[];
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  phone?: string;
  settings: Record<string, any>;
}

// export interface LoginResponse {
//   status: string
//   message: string
//   data: {
//     id: string
//     token: string
//     refreshToken: string
//     permissions: string[]
//   }
// }

export interface LoginResponse {
  statusCode: number;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    permissions: string[];
    customerTypes: string[];
    userId: string;
  };
}

export interface Conversation {
  id: string;
  customerObject: {
    id: string;
    fb_id: string;
    fb_name: string;
    fb_avt: string;
    customer_type?: string;
  };
  userObject: {
    id: string;
    username: string;
    fullName: string;
  };
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  sender_id: string;
  sender_type: "bot" | "user";
  content: string;
  conversation_id: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  fb_id: string;
  fb_name: string;
  fb_avt: string;
  fb_dob?: string;
  db_link?: string;
  customer_type?: string;
}
