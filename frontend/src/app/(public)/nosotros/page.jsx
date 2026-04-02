import Link from 'next/link';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import {
  IconHandshake,
  IconHeart,
  IconStar,
  IconLightning,
  IconTarget,
  IconBinoculars,
  IconStorefront,
  IconPackage,
  IconUsers,
  IconRocket,
  IconShield,
  IconMedal,
  IconCheck,
  IconLocation,
  IconPhone,
} from '@/components/icons';

export const metadata = generateSEOMetadata({
  title: 'Nosotros',
  description: 'Conoce la historia de Dromedicinal, tu droguería de confianza en Bogotá. Nuestra misión, visión y compromiso con tu salud.',
  path: '/nosotros',
});

const stats = [
  { value: '7+',    label: 'Servicios especializados' },
  { value: '500+',  label: 'Productos disponibles' },
  { value: '100%',  label: 'Atención personalizada' },
  { value: '7días', label: 'Atención toda la semana' },
];

const values = [
  {
    icon: IconHandshake,
    title: 'Confianza',
    description: 'Construimos relaciones basadas en la honestidad y la transparencia en cada interacción.',
    accent: 'bg-blue-50 text-brand-blue border-brand-blue/20',
    iconBg: 'bg-brand-blue/10',
    bar: 'bg-brand-blue',
  },
  {
    icon: IconHeart,
    title: 'Compromiso',
    description: 'Nos dedicamos con vocación a brindar la mejor atención a cada cliente, siempre.',
    accent: 'bg-rose-50 text-rose-600 border-rose-200',
    iconBg: 'bg-rose-100',
    bar: 'bg-rose-500',
  },
  {
    icon: IconStar,
    title: 'Calidad',
    description: 'Ofrecemos productos garantizados y servicios de excelencia que cuidan tu bienestar.',
    accent: 'bg-amber-50 text-amber-600 border-amber-200',
    iconBg: 'bg-amber-100',
    bar: 'bg-amber-500',
  },
  {
    icon: IconLightning,
    title: 'Agilidad',
    description: 'Entendemos que tu tiempo es valioso: atención rápida, eficiente y sin esperas.',
    accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-100',
    bar: 'bg-emerald-500',
  },
];

const reasons = [
  {
    icon: IconPackage,
    title: 'Amplio catálogo',
    description: 'Más de 500 productos entre medicamentos, cuidado personal, nutrición y mucho más, todo en un solo lugar.',
    number: '01',
  },
  {
    icon: IconShield,
    title: 'Personal capacitado',
    description: 'Equipo de profesionales farmacéuticos listos para asesorarte con responsabilidad y calidez humana.',
    number: '02',
  },
  {
    icon: IconRocket,
    title: 'Múltiples canales',
    description: 'Pide por WhatsApp, Rappi o visítanos en nuestra tienda física en Engativá, Bogotá.',
    number: '03',
  },
];

export default function NosotrosPage() {
  return (
    <div>

      {/* ── Hero ── */}
      <section className="relative bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-green overflow-hidden">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        {/* Orbe decorativo */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container-app relative py-20 lg:py-28 text-center text-white">
          <span className="inline-block bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Droguería Dromedicinal
          </span>
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6">
            Cuidando tu salud<br />
            <span className="text-brand-green-light">con dedicación</span>
          </h1>
          <p className="text-lg lg:text-xl text-white/85 max-w-2xl mx-auto">
            Somos más que una droguería: somos tu aliado en el bienestar de tu familia,
            con atención personalizada y productos de calidad.
          </p>
        </div>

        {/* ── Barra de estadísticas ── */}
        <div className="relative border-t border-white/15">
          <div className="container-app">
            <div className="grid grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className={`py-6 px-4 text-center ${i < stats.length - 1 ? 'border-r border-white/15' : ''}`}
                >
                  <p className="text-3xl lg:text-4xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/65 text-xs lg:text-sm mt-1 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container-app py-16 lg:py-24 space-y-24">

        {/* ── Historia ── */}
        <section className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-brand-blue text-sm font-semibold uppercase tracking-widest">Nuestra historia</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-6 leading-tight">
              Nacimos para servir a nuestra comunidad
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Dromedicinal nació con el propósito de ofrecer un servicio farmacéutico 
                de calidad, cercano y accesible para la comunidad de Engativá, Bogotá.
              </p>
              <p>
                Desde nuestros inicios nos hemos enfocado en la atención personalizada, 
                entendiendo que cada cliente tiene necesidades únicas y merece un trato especial 
                y profesional.
              </p>
              <p>
                Hoy contamos con un amplio catálogo, servicios especializados de salud y un 
                equipo comprometido con tu bienestar y el de tu familia.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {[
                'Atención farmacéutica personalizada',
                'Servicios de salud en el sitio (toma de tensión, glicemia, inyectología)',
                'Domicilios y múltiples canales de pedido',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                    <IconCheck className="w-3 h-3 text-brand-green" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Tarjeta visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-brand-blue-light to-brand-green-light rounded-3xl p-10 flex flex-col items-center justify-center text-center min-h-72 shadow-xl">
              <div className="w-24 h-24 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-md">
                <IconStorefront className="w-14 h-14 text-brand-blue" />
              </div>
              <p className="font-bold text-xl text-brand-blue">Dromedicinal</p>
              <p className="text-brand-blue/70 text-sm mt-1 flex items-center gap-1.5">
                <IconLocation className="w-4 h-4" />
                Engativá, Bogotá
              </p>
            </div>
            {/* Badge flotante */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Horario</p>
              <p className="text-sm font-bold text-gray-900">Lun – Dom</p>
            </div>
            <div className="absolute -bottom-4 -left-4 bg-brand-blue text-white rounded-2xl shadow-lg px-4 py-3">
              <p className="text-xs text-white/70 font-medium">Servicios</p>
              <p className="text-sm font-bold">7 especializados</p>
            </div>
          </div>
        </section>

        {/* ── Misión y Visión ── */}
        <section>
          <div className="text-center mb-10">
            <span className="text-brand-blue text-sm font-semibold uppercase tracking-widest">Quiénes somos</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Misión y Visión</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Misión */}
            <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-8 hover:shadow-lg transition-shadow">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-blue rounded-l-2xl" />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-brand-blue/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IconTarget className="w-7 h-7 text-brand-blue" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Misión</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Brindar soluciones integrales en salud a través de productos farmacéuticos 
                de calidad y servicios especializados, con un equipo humano comprometido 
                con el bienestar de nuestra comunidad.
              </p>
            </div>
            {/* Visión */}
            <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-8 hover:shadow-lg transition-shadow">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-green rounded-l-2xl" />
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <IconBinoculars className="w-7 h-7 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Visión</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Ser reconocidos como la droguería de confianza en nuestra zona, 
                destacando por la excelencia en el servicio, la innovación en 
                canales de atención y el compromiso con la salud comunitaria.
              </p>
            </div>
          </div>
        </section>

        {/* ── Valores ── */}
        <section>
          <div className="text-center mb-10">
            <span className="text-brand-blue text-sm font-semibold uppercase tracking-widest">Lo que nos define</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">Nuestros valores</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className={`group relative bg-white rounded-2xl border shadow-sm hover:shadow-lg transition-all overflow-hidden ${value.accent}`}
                >
                  {/* Barra de acento superior */}
                  <div className={`h-1 w-full ${value.bar}`} />
                  <div className="p-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${value.iconBg}`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-base mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* ── Por qué elegirnos ── */}
      <section className="bg-gray-900 py-16 lg:py-24">
        <div className="container-app">
          <div className="text-center mb-14">
            <span className="text-brand-green-light text-sm font-semibold uppercase tracking-widest">Nuestra diferencia</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mt-2">¿Por qué elegirnos?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reasons.map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                  <span className="text-6xl font-black text-white/5 select-none absolute top-4 right-6 leading-none">{r.number}</span>
                  <div className="w-12 h-12 rounded-xl bg-brand-green/20 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-brand-green-light" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-3">{r.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{r.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-16 lg:py-20 bg-brand-blue-light">
        <div className="container-app text-center">
          <IconMedal className="w-12 h-12 text-brand-blue mx-auto mb-4" />
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
            ¿Tienes alguna pregunta?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Nuestro equipo está listo para atenderte. Escríbenos o visítanos en nuestra droguería.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 bg-brand-blue text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-blue-dark transition-colors shadow-sm"
            >
              <IconPhone className="w-4 h-4" />
              Contáctanos
            </Link>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-white text-brand-blue font-semibold px-6 py-3 rounded-xl border border-brand-blue/20 hover:border-brand-blue/40 transition-colors shadow-sm"
            >
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

