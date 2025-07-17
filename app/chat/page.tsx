"use client";

import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/contexts/socket-context";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { CustomerProfile } from "@/components/chat/customer-profile";
import { chatApi } from "@/lib/api";
import type { Conversation, Message, Customer } from "@/types";
import { useAuth } from "@/contexts/auth-context";

export default function ChatPage() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [conversations, setConversations] = useState([]);
  const conversationsRef = useRef([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Always keep ref in sync with state
  useEffect(() => {
    conversationsRef.current = conversations;
  }, [conversations]);

  // Load initial conversations
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setLoading(true);
        const data = await chatApi.getListConversation();
        setConversations(data);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Handle socket incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = async (message) => {
      // Update messages if in current conversation
      if (message.conversationId === selectedConversation?.id) {
        setMessages((prev) => [...prev, message]);
      }

      // Check if conversation already exists
      const exists = conversationsRef.current.find(
        (c) => c.id === message.conversationId
      );

      if (!exists) {
        try {
          const newConv = await chatApi.getConversationById(
            message.conversationId
          );
          setConversations((prev) => [newConv, ...prev]);
        } catch (err) {
          console.error("❌ Failed to fetch new conversation", err);
        }
      } else {
        // Update existing conversation with new message
        setConversations((prev) => {
          const updated = prev.map((conv) =>
            conv.id === message.conversationId
              ? {
                  ...conv,
                  lastMessage: message.content,
                  updatedAt: new Date().toISOString(),
                }
              : conv
          );
          return updated.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });
      }
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket, selectedConversation]);

  const handleConversationSelect = async (conversation) => {
    setSelectedConversation(conversation);
    setSelectedCustomer(conversation.customer);
    try {
      const messagesData = await chatApi.getListMessages(conversation.id);
      setMessages(messagesData);
    } catch (error) {
      console.error("❌ Failed to load messages:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !socket || !user) return;

    const messageData = {
      conversation_id: selectedConversation.id,
      sender_id: user.id,
      content,
    };

    // Emit to socket server
    socket.emit("send_mess", messageData);

    // Optimistically update UI
    const newMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderType: "reviewer",
      content,
      conversationId: selectedConversation.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Update conversation list preview
    setConversations((prev) => {
      const updated = prev.map((conv) =>
        conv.id === selectedConversation.id
          ? {
              ...conv,
              lastMessage: content,
              updatedAt: new Date().toISOString(),
            }
          : conv
      );
      return updated.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    });
  };

  const handleShowCustomerProfile = async (customerId: string) => {
    try {
      const customerData = await chatApi.getProfileCustomer(customerId);
      setSelectedCustomer(customerData);
      setShowCustomerProfile(true);
    } catch (error) {
      console.error("❌ Failed to load customer profile:", error);
    }
  };

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* Sidebar - Conversation List */}
      <div className="w-80 border-r bg-gray-50 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          loading={loading}
          isConnected={isConnected}
        />
      </div>

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onShowCustomerProfile={() =>
              handleShowCustomerProfile(selectedConversation.customerId)
            }
            selectedCustomer={selectedCustomer}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Select a conversation
              </h3>
              <p className="text-gray-500 mt-2">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar - Customer Profile */}
      {showCustomerProfile && selectedCustomer && (
        <div className="flex-shrink-0">
          <CustomerProfile
            customer={selectedCustomer}
            isOpen={showCustomerProfile}
            onClose={() => setShowCustomerProfile(false)}
          />
        </div>
      )}
    </div>
  );
}
