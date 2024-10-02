import { WebSocketProvider } from "@/providers/WebSocketProvider";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <WebSocketProvider>
        <div>{children}</div>
    </WebSocketProvider>
  );
}
