"use client";
import { useWebSocket } from "@/providers/WebSocketProvider";
import React, { useState, useEffect } from "react";

export default function ChatPage() {
  const [token, setToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>(""); // State for the message
  const [requestType, setRequestType] = useState<string>("user_message"); // State for the request type
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const webSocketContext = useWebSocket();

  const handleGetToken = async () => {
    const url = `http://localhost:8080/get-token?username=dacs`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors", // Change to 'cors' to handle cross-origin requests properly
      });
      console.log("Response:", response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setToken(data.token);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startConnection = () => {
    // Start WebSocket connection
    if (webSocketContext && token) {
      webSocketContext.startConnection(token);
      setConnected(true);
    } else {
      setError("Token is missing");
    }
  };

  const endConnection = () => {
    // End WebSocket connection
    if (webSocketContext) {
      webSocketContext.endConnection();
      setMessages([]);
      setToken(null);
      setConnected(false);
    }
  };

  const sendMessage = (message: string) => {
    if (webSocketContext && webSocketContext.wsService) {
      webSocketContext.sendMessage(JSON.stringify({ type: requestType, message }));
      setMessage("");
      if (error) {
        setError(null);
      }
    } else {
      setError("WebSocket connection is not established");
    }
  };

  useEffect(() => {
    const listener = (data: any) => {
      // this is where you can handle the incoming messages
      const message = JSON.parse(data);
      switch (message.type) {
        case "user_message":
          setMessages((prevMessages) => [...prevMessages, message.message]);
          break;
        case "system_message":
          setMessages((prevMessages) => [...prevMessages, message.message]);
          break;
        case "pong":
          setMessages((prevMessages) => [...prevMessages, message.message]);
          break;
        default:
          console.log("Unknown message type:", message.type);
          break;
      }
    };

    if (webSocketContext) {
      webSocketContext.addListener(listener);
    }

    // Cleanup function to remove the listener when the component unmounts
    return () => {
      if (webSocketContext) {
        webSocketContext.removeListener(listener);
      }
    };
  }, [webSocketContext]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-4">
      <h1 className="text-3xl font-bold mb-4">Websocket API test UI</h1>
      <button
        onClick={handleGetToken}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Get token
      </button>
      {token && (
        <p className="mb-4 w-3/5 h-auto max-h-20 overflow-auto bg-white shadow-md rounded p-4 break-words">
          Token: {token}
        </p>
      )}
      {connected && <p className="text-green-500 mb-4">WebSocket connected</p>}
      <button
        onClick={startConnection}
        className="bg-green-500 text-white px-4 py-2 rounded mb-4"
      >
        Start WebSocket Connection
      </button>
      <select
        value={requestType}
        onChange={(e) => setRequestType(e.target.value)}
        className="mb-4 p-2 border rounded"
      >
        <option value="user_message">user_message</option>
        <option value="system_message">system_message</option>
        <option value="ping">ping</option>
        {/* Add more options as needed */}
      </select>
      {messages.length > 0 && (
        <ul className="bg-white shadow-md rounded p-4 mb-4 w-full max-w-md">
          {messages.map((message, index) => (
            <li key={index} className="border-b last:border-none py-2">
              {message}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex items-center mb-4 w-full max-w-md">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow border rounded px-4 py-2 mr-2"
        />
        <button
          onClick={() => sendMessage(message)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send Message
        </button>
      </div>
      <button
        onClick={endConnection}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        End WebSocket Connection
      </button>
    </div>
  );
}
