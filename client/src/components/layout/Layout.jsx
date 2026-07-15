import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Layout({ children }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#FDFBF7',
            color: '#1A1A1A',
            border: '1px solid #F4ECD8',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#D4A017', secondary: '#FDFBF7' } },
          error: { iconTheme: { primary: '#7A1F1F', secondary: '#FDFBF7' } },
        }}
      />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
