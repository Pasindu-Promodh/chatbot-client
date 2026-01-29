//============================ Name Generator Version ============================//

// import { useState, useRef, useEffect } from "react";

// type Role = "user" | "assistant";

// type Message = {
//   role: Role;
//   content: string;
// };

// const QUESTIONS = [
//   {
//     key: "gender",
//     question: "👶 What gender are you looking for? (Boy / Girl / Unisex)",
//   },
//   {
//     key: "origin",
//     question:
//       "🌍 Any cultural or origin preference? (Sinhala / Tamil / English / Any)",
//   },
//   {
//     key: "style",
//     question: "✨ Name style? (Modern / Classic / Unique / Trendy)",
//   },
//   {
//     key: "length",
//     question: "📏 Preferred length? (Short / Medium / Long / None)",
//   },
// ];

// function App() {
//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, string>>({});

//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     setMessages([
//       {
//         role: "assistant",
//         content: QUESTIONS[0].question,
//       },
//     ]);
//   }, []);

//   useEffect(() => {
//     setTimeout(() => {
//       bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, 50);
//   }, [messages]);

//   const sendMessage1 = async () => {
//     if (!input.trim() || loading) return;

//     const userMessage: Message = { role: "user", content: input };
//     const assistantMessage: Message = { role: "assistant", content: "" };

//     setMessages((prev) => [...prev, userMessage, assistantMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       // const response = await fetch("http://localhost:3001/chat-stream", {
//       const response = await fetch("chatbot-server-production-746e.up.railway.app:3001/chat-stream", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           message: userMessage.content,
//           history: [...messages, userMessage],
//         }),
//       });

//       const reader = response.body?.getReader();
//       if (!reader) throw new Error("No stream from server");

//       const decoder = new TextDecoder("utf-8");
//       let buffer = "";

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });
//         const lines = buffer.split("\n");
//         buffer = lines.pop() || "";

//         for (const line of lines) {
//           if (!line.startsWith("data: ")) continue;
//           const text = line.replace("data: ", "");
//           if (!text || text === "[DONE]") continue;

//           // Unescape newlines that were escaped in the backend
//           const unescapedText = text.replace(/\\n/g, "\n");

//           setMessages((prev) => {
//             const updated = [...prev];
//             const last = updated[updated.length - 1];
//             if (last.role === "assistant") {
//               updated[updated.length - 1] = {
//                 ...last,
//                 content: last.content + unescapedText,
//               };
//             }
//             return updated;
//           });
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev.slice(0, -1),
//         { role: "assistant", content: "Oops! Something went wrong." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = async () => {
//     if (!input.trim() || loading) return;

//     const userAnswer = input;
//     const currentQuestion = QUESTIONS[step];

//     setMessages((prev) => [...prev, { role: "user", content: userAnswer }]);

//     setAnswers((prev) => ({
//       ...prev,
//       [currentQuestion.key]: userAnswer,
//     }));

//     setInput("");

//     // If there are more questions, ask next one
//     if (step < QUESTIONS.length - 1) {
//       setStep(step + 1);
//       setMessages((prev) => [
//         ...prev,
//         {
//           role: "assistant",
//           content: QUESTIONS[step + 1].question,
//         },
//       ]);
//       return;
//     }

//     // All questions answered → now call AI
//     generateNames({
//       ...answers,
//       [currentQuestion.key]: userAnswer,
//     });
//   };

//   const generateNames = async (preferences: Record<string, string>) => {
//     setLoading(true);

//     setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

//     const prompt = `
// Generate baby names in sinhala with the following preferences:

// - Gender: ${preferences.gender}
// - Origin: ${preferences.origin}
// - Style: ${preferences.style}
// - Length: ${preferences.length}

// Give 8 unique names with brief meanings.
// `;

//     try {
//       // const response = await fetch("http://localhost:3001/chat-stream", {
//       const response = await fetch("https://chatbot-server-production-9237.up.railway.app/chat-stream", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           message: prompt,
//           history: [],
//         }),
//       });

//       const reader = response.body?.getReader();
//       if (!reader) throw new Error("No stream from server");

//       const decoder = new TextDecoder("utf-8");
//       let buffer = "";

//       while (true) {
//         const { value, done } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });
//         const lines = buffer.split("\n");
//         buffer = lines.pop() || "";

//         for (const line of lines) {
//           if (!line.startsWith("data: ")) continue;
//           const text = line.replace("data: ", "");
//           if (!text || text === "[DONE]") continue;

//           // Unescape newlines that were escaped in the backend
//           const unescapedText = text.replace(/\\n/g, "\n");

//           setMessages((prev) => {
//             const updated = [...prev];
//             const last = updated[updated.length - 1];
//             if (last.role === "assistant") {
//               updated[updated.length - 1] = {
//                 ...last,
//                 content: last.content + unescapedText,
//               };
//             }
//             return updated;
//           });
//         }
//       }
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev.slice(0, -1),
//         { role: "assistant", content: "Oops! Something went wrong." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderContent = (content: string) => {
//     const lines = content.split("\n");
//     return lines.map((line, idx) => {
//       const parts = [];
//       let lastIndex = 0;
//       const regex = /\*\*(.*?)\*\*/g;
//       let match;

//       while ((match = regex.exec(line)) !== null) {
//         if (match.index > lastIndex) {
//           parts.push(line.substring(lastIndex, match.index));
//         }
//         parts.push(<strong key={`${idx}-${match.index}`}>{match[1]}</strong>);
//         lastIndex = match.index + match[0].length;
//       }

//       if (lastIndex < line.length) {
//         parts.push(line.substring(lastIndex));
//       }

//       return (
//         <span key={idx}>
//           {parts.length > 0 ? parts : line}
//           {idx < lines.length - 1 && <br />}
//         </span>
//       );
//     });
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "Arial" }}>
//       <h2 style={{ textAlign: "center" }}>AI Baby Name Generator</h2>

//       <div
//         style={{
//           border: "1px solid #ccc",
//           borderRadius: 8,
//           padding: 10,
//           minHeight: 400,
//           maxHeight: 500,
//           overflowY: "auto",
//           backgroundColor: "#f9f9f9",
//         }}
//       >
//         {messages.map((m, i) => {
//           const isLastAssistant =
//             i === messages.length - 1 && m.role === "assistant" && loading;
//           return (
//             <div
//               key={i}
//               style={{
//                 marginBottom: 10,
//                 display: "flex",
//                 justifyContent: m.role === "user" ? "flex-end" : "flex-start",
//               }}
//             >
//               <div
//                 style={{
//                   backgroundColor: m.role === "user" ? "#4caf50" : "#e0e0e0",
//                   color: m.role === "user" ? "white" : "black",
//                   padding: "8px 12px",
//                   borderRadius: 12,
//                   maxWidth: "80%",
//                   wordWrap: "break-word",
//                 }}
//               >
//                 {renderContent(m.content)}
//                 {isLastAssistant && (
//                   <span
//                     style={{
//                       display: "inline-block",
//                       marginLeft: 2,
//                       width: 8,
//                       animation: "blink 1s infinite",
//                     }}
//                   >
//                     |
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//         <div ref={bottomRef}></div>
//       </div>

//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         disabled={loading}
//         placeholder={
//           step < QUESTIONS.length ? "Type your answer" : "Generating names..."
//         }
//         style={{
//           width: "100%",
//           padding: 10,
//           marginTop: 10,
//           borderRadius: 8,
//           border: "1px solid #ccc",
//           boxSizing: "border-box",
//         }}
//       />

//       <style>{`
//         @keyframes blink {
//           0%, 50%, 100% { opacity: 1; }
//           25%, 75% { opacity: 0; }
//         }
//       `}</style>
//     </div>
//   );
// }

// export default App;

//============================ Customer Support Chat Version ============================//

import { useState, useRef, useEffect } from "react";
import logo from "/logo.jpg";


type Stage = "prechat" | "chat";

type Role = "user" | "assistant";

type Message = {
  role: Role;
  content: string;
  streaming?: boolean;
};

export default function App() {
  const [stage, setStage] = useState<Stage>("prechat");
  const [, setLanguage] = useState<"en" | "si" | "ta">("en");

  // const [messages, setMessages] = useState<Message[]>([
  //   {
  //     role: "assistant",
  //     content:
  //       "Welcome to **SDB Bank** 💼\n\nI’m the SDB virtual assistant. I can help with questions about accounts, cards, loans, digital banking, and branch services.\n\n⚠️ Please don’t share sensitive information like account numbers, PINs, passwords, or OTPs.",
  //   },
  // ]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to **SDB Bank** 💼\n\nPlease select your preferred language to continue:",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input };
    const assistantMessage: Message = {
      role: "assistant",
      content: "",
      streaming: true,
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setInput("");
    setLoading(true);

    try {
      // replace with your Railway server URL
      const response = await fetch(
        "https://chatbot-server-production-9237.up.railway.app/chat-stream",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage.content,
            history: messages,
          }),
        },
      );

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No stream from server");

      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const text = line.replace("data: ", "");
          if (!text || text === "[DONE]") continue;

          const unescapedText = text.replace(/\\n/g, "\n");

          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + unescapedText,
              };
            }
            return updated;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content:
            "Sorry—something went wrong. Please try again or contact SDB customer support.",
        },
      ]);
    } finally {
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last.role === "assistant") {
          copy[copy.length - 1] = { ...last, streaming: false };
        }
        return copy;
      });
      setLoading(false);
    }
  };

  const handleLanguageSelect = (lang: "en" | "si" | "ta") => {
    setLanguage(lang);

    const label = lang === "en" ? "English" : lang === "si" ? "සිංහල" : "தமிழ்";

    setMessages((prev) => [
      ...prev,
      { role: "user", content: label },
      {
        role: "assistant",
        content:
          lang === "en"
            ? "Great! How can I help you today?"
            : lang === "si"
              ? "හොඳයි! ඔබට අද කෙසේ උපකාර කළ හැකිද?"
              : "நன்று! இன்று நான் உங்களுக்கு எப்படி உதவலாம்?",
      },
    ]);

    setStage("chat");
  };

  const renderContent = (content: string) => {
    const lines = content.split("\n");

    const urlRegex =
      /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi;

    const boldRegex = /\*\*(.*?)\*\*/g;

    const renderTextWithLinks = (text: string) => {
      const nodes: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = urlRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          nodes.push(text.slice(lastIndex, match.index));
        }

        const url = match[0];
        const href = url.startsWith("http")
          ? url
          : url.includes("@")
            ? `mailto:${url}`
            : `https://${url}`;

        nodes.push(
          <a
            key={`${match.index}-${url}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#1565c0",
              textDecoration: "underline",
              wordBreak: "break-word",
            }}
          >
            {url}
          </a>,
        );

        lastIndex = match.index + url.length;
      }

      if (lastIndex < text.length) {
        nodes.push(text.slice(lastIndex));
      }

      return nodes;
    };

    return lines.map((line, lineIdx) => {
      const parts: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(
            <span key={`text-${lineIdx}-${lastIndex}`}>
              {renderTextWithLinks(line.slice(lastIndex, match.index))}
            </span>,
          );
        }

        parts.push(
          <strong key={`bold-${lineIdx}-${match.index}`}>
            {renderTextWithLinks(match[1])}
          </strong>,
        );

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < line.length) {
        parts.push(
          <span key={`text-${lineIdx}-end`}>
            {renderTextWithLinks(line.slice(lastIndex))}
          </span>,
        );
      }

      return (
        <span key={lineIdx}>
          {parts}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial",
        background: "#ffffff",
      }}
    >
      {/* Header */}
      <div
  style={{
    display: "flex",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #ddd",
    position: "relative",
  }}
>
  {/* Logo */}
  <img
    src={logo} // or your imported logo
    alt="SDB Bank"
    style={{
      height: 28,
      width: "auto",
    }}
  />

  {/* Title (perfectly centered) */}
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      textAlign: "center",
      fontWeight: 600,
      fontSize: "16px",
      pointerEvents: "none", // prevents blocking logo clicks
    }}
  >
    SDB AI Companion
  </div>
</div>


      {/* Chat area */}
      <div
        style={{
          flex: 1,
          padding: 12,
          overflowY: "auto",
          overscrollBehavior: "contain",
          background: "#f5f5f5",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 10,
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                background: m.role === "user" ? "#1e88e5" : "#e0e0e0",
                color: m.role === "user" ? "white" : "black",
                padding: "10px 14px",
                borderRadius: 16,
                maxWidth: "85%",
                fontSize: 14,
                lineHeight: 1.4,
                whiteSpace: "pre-wrap",
              }}
            >
              {renderContent(m.content)}

              {/* Typing indicator */}
              {m.streaming && (
                <span className="typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              )}
            </div>
          </div>
        ))}
        {stage === "prechat" && (
          <div style={{ display: "flex", gap: 8, padding: "8px 0" }}>
            {[
              { code: "en", label: "English" },
              { code: "si", label: "සිංහල" },
              { code: "ta", label: "தமிழ்" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code as any)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 16,
                  border: "1px solid #1e88e5",
                  background: "#fff",
                  color: "#1e88e5",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar (sticky, keyboard-safe) */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          padding: "10px",
          borderTop: "1px solid #ddd",
          background: "#fff",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={input}
          disabled={loading || stage !== "chat"}
          autoFocus
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={
            stage === "chat"
              ? "Type your message…"
              : "Please select a language above"
          }
          style={{
            flex: 1,
            padding: "12px 14px",
            borderRadius: 20,
            border: "1px solid #ccc",
            fontSize: 16, // prevents iOS zoom
            outline: "none",
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading || !input.trim() || stage !== "chat"}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            background: "#1e88e5",
            color: "white",
            fontSize: 18,
            cursor: "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          ➤
        </button>
      </div>

      {/* Animations */}
      <style>{`
      .typing {
        display: inline-flex;
        gap: 4px;
        margin-left: 6px;
      }

      .typing span {
        width: 6px;
        height: 6px;
        background: #555;
        border-radius: 50%;
        animation: bounce 1.4s infinite both;
      }

      .typing span:nth-child(1) { animation-delay: 0s; }
      .typing span:nth-child(2) { animation-delay: 0.2s; }
      .typing span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
    `}</style>
    </div>
  );
}
