"use client";

import { useState, useEffect } from "react";
import { useSocket } from "@/contexts/socket-context";
import { ConversationList } from "@/components/chat/conversation-list";
import { ChatWindow } from "@/components/chat/chat-window";
import { CustomerProfile } from "@/components/chat/customer-profile";
import { chatApi } from "@/lib/api";
import type { Conversation, Message, Customer } from "@/types";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [showCustomerProfile, setShowCustomerProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    loadConversations();
  }, []);

  const handleReceiveMessage = async (message) => {
    if (message.conversation_id === selectedConversation?.id) {
      setMessages((prev) => [...prev, message]);
    }

    const exists = conversations.find((c) => c.id === message.conversation_id);
    if (!exists) {
      try {
        const newConv = await chatApi.getConversationById(
          message.conversation_id
        );
        setConversations((prev) => [newConv, ...prev]);
      } catch (err) {
        console.error("Failed to fetch new conversation", err);
      }
    } else {
      setConversations((prev) => {
        const updated = prev.map((conv) =>
          conv.id === message.conversation_id
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

  useEffect(() => {
    if (socket) {
      socket.on("receive_mess", (message: Message) => {
        handleReceiveMessage(message);
      });

      return () => {
        socket.off("receive_mess");
      };
    }
  }, [socket]);

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

  const handleConversationSelect = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    try {
      const messagesData = await chatApi.getListMessages(conversation.id);
      setMessages(messagesData);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !socket) return;

    const messageData = {
      conversation_id: selectedConversation.id,
      sender_id: "reviewer_1", // This should come from auth context
      content,
    };

    socket.emit("send_mess", messageData);

    // Optimistically add message to UI
    const newMessage: Message = {
      id: Date.now().toString(),
      sender_id: "reviewer_1",
      sender_type: "user",
      content,
      conversation_id: selectedConversation.id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Cập nhật UI: hội thoại
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
      console.error("Failed to load customer profile:", error);
    }
  };

  return (
    <div className="h-full bg-white flex overflow-hidden">
      {/* Conversation List */}
      <div className="w-80 border-r bg-gray-50 flex-shrink-0">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          loading={loading}
          isConnected={isConnected}
        />
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onShowCustomerProfile={() =>
              handleShowCustomerProfile(selectedConversation.customerObject.id)
            }
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

      {/* Customer Profile Sidebar */}
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
