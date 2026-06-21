import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { fetchMe } from './store/authSlice';
import AppRouter from './routes/router';
import ChatWidget from './components/chatbot/ChatWidget';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRouter />
      <ChatWidget />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}
