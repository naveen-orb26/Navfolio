'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, ShieldCheck } from 'lucide-react';

interface MessageItemProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  isStreaming?: boolean;
}

export function MessageItem({ role, content, isStreaming }: MessageItemProps) {
  const isUser = role === 'user';

  return (
    <div
      className={`flex items-start gap-3 w-full p-4 rounded-xl transition-colors ${
        isUser
          ? 'bg-white/[0.03] border border-white/5 ml-auto max-w-[85%]'
          : 'bg-[#121217]/90 border border-white/10 max-w-full shadow-lg'
      }`}
    >
      {/* Avatar Icon */}
      <div
        className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${
          isUser
            ? 'bg-zinc-800 text-zinc-300 border border-white/10'
            : 'bg-violet-950/80 text-violet-400 border border-violet-500/30'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div className="flex-1 overflow-hidden space-y-2 text-sm text-zinc-200">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-semibold text-zinc-400">
            {isUser ? 'You' : "Naveen's AI Advocate"}
          </span>
          {!isUser && (
            <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3" /> Grounded Fact
            </span>
          )}
        </div>

        {/* Markdown Renderer */}
        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-white/10 font-sans">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors font-medium inline-flex items-center gap-1"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Streaming Indicator */}
        {isStreaming && (
          <div className="flex items-center gap-1.5 pt-1 text-xs text-violet-400 font-mono animate-pulse">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            <span>Streaming verification reply...</span>
          </div>
        )}
      </div>
    </div>
  );
}
