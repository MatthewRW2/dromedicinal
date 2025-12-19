import { generateMetadata as generateSEOMetadata } from '@/lib/seo';

export const metadata = generateSEOMetadata({
  title: 'PQRS - Peticiones, Quejas, Reclamos y Sugerencias',
  description: 'Formulario PQRS de Droguería Dromedicinal. Envíanos tus peticiones, quejas, reclamos o sugerencias.',
  path: '/pqrs',
});

export default function PqrsLayout({ children }) {
  return children;
}

