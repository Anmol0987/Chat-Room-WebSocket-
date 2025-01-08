import { useEffect, useRef, useState } from "react";
import { ChatIcon } from "./icon/ChatIcon";
import { SendIcon } from "./icon/SendIcon";

function App() {
  const [messages, setMessages] = useState<string[]>([]);

  const InputRef = useRef<HTMLInputElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const sendMessage = () => {
    const message = InputRef.current?.value
    //@ts-ignore
    wsRef.current.send(JSON.stringify({ type: "chat", payload: { message: message } }))
    
    if (InputRef.current) {
      InputRef.current.value = "";
    }

  }

  useEffect(() => {

    const ws = new WebSocket("ws://localhost:8080")
    ws.onmessage = (event) => {
      //@ts-ignore
      setMessages(m => [...m, event.data])
    }
    wsRef.current = ws
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join", payload: { roomId: "1", name: "test" } }))
    }

    return () => {
      ws.close()
    }
  }, [])


  return (
    <div className="h-screen bg-black flex justify-center items-center">
      <div className="bg-black h-[80vh] w-2/4 border-2 border-white rounded flex flex-col">
        {/* Header */}
        <div className="bg-black h-[10%] flex items-center px-4 border-b-2 border-white">
          <div className="text-white flex items-center gap-2">
            <ChatIcon />
            <h1 className="text-2xl">Real-Time Chatting . . .</h1>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 bg-black overflow-y-scroll px-4 py-4 no-scrollbar">
          <div className="flex flex-col gap-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="self-end bg-black rounded-full rounded-bl-none border-2 border-white text-white py-2 px-5"
              >
                {msg}
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-black h-[10%] flex items-center gap-3 px-4 py-4 border-t-2 border-white">
          <input
            ref={InputRef}
            className="bg-gray-700 text-white outline-none rounded px-2 py-2 flex-1"
            type="text"
            placeholder="Message . . . . "
          />
          <button
            onClick={sendMessage}
            className="text-white bg-gray-700 rounded-full p-3 flex items-center gap-2"
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>

  )
}

export default App
