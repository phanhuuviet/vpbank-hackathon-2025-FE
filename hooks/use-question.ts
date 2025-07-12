"use client";

import { useState, useEffect } from "react";
import type { Question, Message, Note } from "@/types";
import { questionsApi, messagesApi, notesApi } from "@/lib/api";
import { useSocket } from "@/contexts/socket-context";

export function useQuestion(questionId: string) {
  const [question, setQuestion] = useState<Question | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [questionData, messagesData, notesData] = await Promise.all([
          questionsApi.getQuestion(questionId),
          messagesApi.getMessages(questionId),
          notesApi.getNotes(questionId),
        ]);

        setQuestion(questionData);
        setMessages(messagesData);
        setNotes(notesData);
      } catch (error) {
        console.error("Failed to fetch question data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      fetchData();
    }
  }, [questionId]);

  useEffect(() => {
    if (socket && questionId) {
      socket.on("new_message", (message: Message) => {
        if (message.questionId === questionId) {
          setMessages((prev) => [...prev, message]);
        }
      });

      socket.on("new_note", (note: Note) => {
        if (note.questionId === questionId) {
          setNotes((prev) => [...prev, note]);
        }
      });

      return () => {
        socket.off("new_message");
        socket.off("new_note");
      };
    }
  }, [socket, questionId]);

  const sendMessage = async (content: string) => {
    const message = await messagesApi.sendMessage(questionId, content);
    setMessages((prev) => [...prev, message]);

    if (socket) {
      socket.emit("send_message", { questionId, content });
    }
  };

  const addNote = async (content: string) => {
    const note = await notesApi.addNote(questionId, content);
    setNotes((prev) => [...prev, note]);

    if (socket) {
      socket.emit("add_note", { questionId, content });
    }
  };

  const updateStatus = async (status: "NEW" | "REVIEWED" | "NOTED") => {
    const updatedQuestion = await questionsApi.updateStatus(questionId, status);
    setQuestion(updatedQuestion);

    if (socket) {
      socket.emit("update_status", { questionId, status });
    }
  };

  return {
    question,
    messages,
    notes,
    loading,
    sendMessage,
    addNote,
    updateStatus,
  };
}
