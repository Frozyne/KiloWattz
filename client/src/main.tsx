console.log("MOCK:", import.meta.env.VITE_USE_MOCK, import.meta.env.VITE_API_BASE_URL);
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router'
import { useAuthStore } from './storage/useAuthStorage.ts'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SocketProvider } from './context/socketContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
})


if (import.meta.env.VITE_USE_MOCK === "true" && !useAuthStore.getState().isAuthenticated) {
  useAuthStore.getState().setAuth(
    {
      id: "u1",
      name: "Praise Komolafe",
      email: "komolafe018@gmail.com",
      role: "Admin", // switch to "User" to test the resident view
    },
    "mock-token"
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SocketProvider>
        <App />
    </SocketProvider>
     </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
