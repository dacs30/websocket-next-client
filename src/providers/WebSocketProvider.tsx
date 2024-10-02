'use client';
import WebSocketService from '@/services/WebsocketService';
import React, { createContext, useContext, useState, useCallback } from 'react';

const WebSocketContext = createContext<{
  wsService: WebSocketService | null;
  startConnection: (jwtToken: string) => void;
  endConnection: () => void;
  sendMessage: (message: string) => void;
  addListener: (listener: Function) => void;
  removeListener: (listener: Function) => void;
} | null>(null);

import { ReactNode } from 'react';

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [wsService, setWsService] = useState<WebSocketService | null>(null);

  const startConnection = useCallback((jwtToken: string) => {
    const service = new WebSocketService('ws://localhost:8080', jwtToken);
    service.connect();
    setWsService(service);
  }, []);

  const endConnection = useCallback(() => {
    if (wsService) {
      wsService.socket?.close();
      setWsService(null);
    }
  }, [wsService]);

  const sendMessage = useCallback((message: string) => {
    if (wsService) {
      wsService.sendMessage(message);
    }
  }, [wsService]);

  const addListener = useCallback((listener: Function) => {
    if (wsService) {
      wsService.addListener(listener);
    }
  }, [wsService]);

  const removeListener = useCallback((listener: Function) => {
    if (wsService) {
      wsService.removeListener(listener);
    }
  }, [wsService]);

  return (
    <WebSocketContext.Provider value={{ wsService, startConnection, endConnection, sendMessage, addListener, removeListener }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};