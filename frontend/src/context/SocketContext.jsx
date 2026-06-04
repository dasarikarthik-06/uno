import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext.jsx';

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { token, user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!token || !user) return;
    const client = io('http://localhost:8000', {
      auth: { token },
      transports: ['websocket'],
    });
    setSocket(client);
    return () => client.disconnect();
  }, [token, user]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}
