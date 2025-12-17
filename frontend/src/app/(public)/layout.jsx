import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

/**
 * Layout para páginas públicas
 * Incluye Header y Footer comunes
 */
export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

