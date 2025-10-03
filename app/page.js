
"use client";
import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages([...newMessages, data.reply]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6">AI Chat App</h1>

      {/* Chat container */}
      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-6">
        {/* Chat messages */}
        <div className="flex-1 bg-[#0d1117] border border-gray-700 rounded-xl p-4 flex flex-col space-y-3 h-[500px] overflow-y-auto">
          {messages
            .filter((m) => m.role !== "system")
            .map((msg, i) => (
              <div
                key={i}
                className={`px-3 py-2 rounded-lg text-sm ${msg.role === "user"
                    ? "bg-blue-600 text-white self-end"
                    : "bg-gray-800 text-gray-200 self-start"
                  }`}
              >
                {msg.content}
              </div>
            ))}
          {loading && <p className="text-gray-400">Thinking...</p>}
        </div>
      </div>

      {/* Input bar */}
      <div className="mt-6 w-full max-w-3xl flex space-x-2">
        <textarea
          className="flex-1 bg-[#0d1117] border border-gray-700 text-gray-200 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
        >
          Send
        </button>
      </div>

      <footer className="mt-6 text-gray-500 text-sm">
        Custom Chat — Built with OpenAI API
      </footer>
    </div>
  );
}

