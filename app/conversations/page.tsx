"use client";

import React, { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { NxChatBubble } from '@/components/NxChatBubble';
import { NxChatInput } from '@/components/NxChatInput';
import { NxMessageActions } from '@/components/NxMessageActions';
import { MessageSquare, Users, History, Hash } from 'lucide-react';
import { useAppStore } from '@/store/store-provider';
import apiClient from '@/lib/api/client';
import { Loader2 } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
}

export default function ConversationsPage() {
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{id?: number, role: 'user' | 'assistant' | 'system', content: string, created_at?: string}[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  React.useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await apiClient.get('/conversations');
        const data = res.data?.data || [];
        const mapped = data.map((c: any) => ({
          id: c.id.toString(),
          title: c.title || c.contact?.name || 'Unknown',
          lastMessage: c.messages?.[0]?.content || 'No messages yet',
          timestamp: c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '',
          unread: 0,
        }));
        setConversations(mapped);
        if (mapped.length > 0) setActiveConv(mapped[0].id);
      } catch (err) {
        console.error('Failed to load conversations', err);
      } finally {
        setLoadingConvs(false);
      }
    };
    fetchConversations();
  }, []);

  React.useEffect(() => {
    if (!activeConv) return;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await apiClient.get(`/conversations/${activeConv}/messages`);
        const msgs = res.data?.data?.messages || [];
        setMessages(msgs.map((m: any) => ({
          id: m.id,
          role: m.sender === 'user' ? 'user' : m.sender === 'system' ? 'system' : 'assistant',
          content: m.content,
          created_at: m.created_at,
        })));
      } catch (err) {
        console.error('Failed to load messages', err);
      } finally {
        setLoadingMessages(false);
      }
    };
    fetchMessages();
  }, [activeConv]);
  
  const handleSendMessage = async (text: string) => {
    if (!activeConv) return;
    setIsSending(true);
    setMessages(prev => [...prev, { role: 'user', content: text, created_at: new Date().toISOString() }]);
    try {
      await apiClient.post(`/conversations/${activeConv}/messages`, {
        content: text,
        sender: 'user',
        channel: 'chat'
      });
      // Optionally re-fetch messages or let websockets handle it. 
      // For now we assume websocket updates or user refetch, but we can do a quick refetch to ensure consistency:
      const res = await apiClient.get(`/conversations/${activeConv}/messages`);
      const msgs = res.data?.data?.messages || [];
      setMessages(msgs.map((m: any) => ({
        id: m.id,
        role: m.sender === 'user' ? 'user' : m.sender === 'system' ? 'system' : 'assistant',
        content: m.content,
        created_at: m.created_at,
      })));
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex h-full w-full max-w-7xl mx-auto overflow-hidden bg-black/20 border-x border-white/5">
        {/* Left Sidebar (Conversations List) */}
        <div className="w-80 border-r border-white/10 flex flex-col bg-surface-dark/30">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-nexus-blue" />
              Conversations
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {loadingConvs ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center text-gray-500 text-sm p-4">No conversations found</div>
            ) : (
              conversations.map(conv => (
                <button 
                  key={conv.id}
                  onClick={() => setActiveConv(conv.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex flex-col gap-1 ${
                    activeConv === conv.id 
                      ? 'bg-nexus-blue/10 border border-nexus-blue/20' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center w-full">
                    <span className={`font-medium truncate ${activeConv === conv.id ? 'text-nexus-blue' : 'text-gray-200'}`}>
                      {conv.title}
                    </span>
                    <span className="text-[10px] text-gray-500 shrink-0">{conv.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center w-full">
                    <p className="text-xs text-gray-400 truncate pr-4">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="shrink-0 bg-nexus-blue text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative h-full">
          {/* Main header */}
          <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-surface-dark/50 shrink-0">
             <div className="flex items-center gap-3">
               <Hash className="w-4 h-4 text-gray-500" />
               <span className="font-semibold text-gray-200">
                 {conversations.find(c => c.id === activeConv)?.title || 'Select a conversation'}
               </span>
             </div>
             <div className="flex items-center gap-3">
               <button className="text-gray-400 hover:text-white transition-colors p-2">
                 <Users className="w-4 h-4" />
               </button>
               <button className="text-gray-400 hover:text-white transition-colors p-2">
                 <History className="w-4 h-4" />
               </button>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
            {loadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-nexus-blue/50" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-full text-gray-500">
                No messages yet. Send a message to start the conversation.
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={m.id || i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${m.role === 'user' ? 'order-1' : 'order-2'}`}>
                    <NxChatBubble 
                      id={`msg-${m.id || i}`}
                      content={m.content} 
                      role={m.role === 'user' ? 'user' : 'assistant'} 
                      timestamp={m.created_at ? new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 border-t border-white/5 bg-surface-dark/30 shrink-0">
            <NxChatInput 
              onSend={handleSendMessage} 
              isProcessing={isSending} 
              placeholder="Type your message..."
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
