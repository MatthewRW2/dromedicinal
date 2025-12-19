/**
 * Iconos centralizados para Dromedicinal
 * Usando react-icons (Heroicons, Phosphor, etc.)
 */

// Heroicons (estilo outline y solid)
import {
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineTag,
  HiOutlineGift,
  HiOutlineCog,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineDocumentText,
  HiOutlineLink,
  HiOutlineQuestionMarkCircle,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePhotograph,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineInformationCircle,
  HiOutlineXCircle,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineGlobe,
  HiOutlineHeart,
  HiOutlineStar,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineBeaker,
  HiOutlineSparkles,
  HiOutlineCube,
  HiOutlineCollection,
  HiOutlineViewGrid,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineRefresh,
  HiOutlineLogout,
  HiOutlineLogin,
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlineAdjustments,
  HiOutlineBell,
  HiOutlineAnnotation,
  HiOutlineSupport,
} from 'react-icons/hi';

import { HiMiniChevronDoubleLeft, HiMiniChevronDoubleRight } from 'react-icons/hi2';

// Phosphor Icons (estilo distintivo)
import {
  PiPillDuotone,
  PiSyringeDuotone,
  PiHeartbeatDuotone,
  PiDropDuotone,
  PiFirstAidKitDuotone,
  PiBabyDuotone,
  PiFlowerDuotone,
  PiOrangeDuotone,
  PiStorefrontDuotone,
  PiHandshakeDuotone,
  PiTargetDuotone,
  PiBinocularsDuotone,
  PiRocketDuotone,
  PiMedalDuotone,
  PiLightningDuotone,
  PiShoppingCartDuotone,
  PiPackageDuotone,
  PiSprayBottleDuotone,
} from 'react-icons/pi';

// Font Awesome (íconos de redes sociales)
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
} from 'react-icons/fa';

// Bi (Bootstrap Icons)
import { BiSolidOffer } from 'react-icons/bi';

// ===========================================
// ICONOS DE NAVEGACIÓN Y UI
// ===========================================

export const IconMenu = HiOutlineMenu;
export const IconClose = HiOutlineX;
export const IconSearch = HiOutlineSearch;
export const IconFilter = HiOutlineFilter;
export const IconChevronLeft = HiOutlineChevronLeft;
export const IconChevronRight = HiOutlineChevronRight;
export const IconChevronDown = HiOutlineChevronDown;
export const IconChevronUp = HiOutlineChevronUp;
export const IconChevronDoubleLeft = HiMiniChevronDoubleLeft;
export const IconChevronDoubleRight = HiMiniChevronDoubleRight;
export const IconPlus = HiOutlinePlus;
export const IconMinus = HiOutlineMinus;
export const IconEdit = HiOutlinePencil;
export const IconDelete = HiOutlineTrash;
export const IconTrash = HiOutlineTrash;
export const IconImage = HiOutlinePhotograph;
export const IconExternalLink = HiOutlineGlobe;
export const IconRefresh = HiOutlineRefresh;
export const IconEye = HiOutlineEye;
export const IconEyeOff = HiOutlineEyeOff;
export const IconSettings = HiOutlineAdjustments;
export const IconBell = HiOutlineBell;

// ===========================================
// ICONOS DE ESTADO / FEEDBACK
// ===========================================

export const IconCheck = HiOutlineCheck;
export const IconCheckCircle = HiOutlineCheckCircle;
export const IconWarning = HiOutlineExclamation;
export const IconError = HiOutlineXCircle;
export const IconInfo = HiOutlineInformationCircle;
export const IconAlertCircle = HiOutlineExclamation; // Alias para AlertCircle

// ===========================================
// ICONOS DE CONTACTO
// ===========================================

export const IconLocation = HiOutlineLocationMarker;
export const IconPhone = HiOutlinePhone;
export const IconMail = HiOutlineMail;
export const IconClock = HiOutlineClock;
export const IconGlobe = HiOutlineGlobe;

// ===========================================
// ICONOS DE REDES SOCIALES
// ===========================================

export const IconWhatsApp = FaWhatsapp;
export const IconInstagram = FaInstagram;
export const IconFacebook = FaFacebookF;

// Icono de Rappi personalizado
export function IconRappi({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9h4v2h-4v2l-3-3 3-3v2z"/>
    </svg>
  );
}

// ===========================================
// ICONOS DE CATEGORÍAS DE PRODUCTOS
// ===========================================

export const IconPill = PiPillDuotone; // Medicamentos
export const IconSprayBottle = PiSprayBottleDuotone; // Cuidado personal
export const IconBaby = PiBabyDuotone; // Bebés y niños
export const IconFlower = PiFlowerDuotone; // Dermocosméticos / Belleza
export const IconOrange = PiOrangeDuotone; // Vitaminas
export const IconFirstAid = PiFirstAidKitDuotone; // Primeros auxilios
export const IconPackage = PiPackageDuotone; // Productos genéricos

// ===========================================
// ICONOS DE SERVICIOS
// ===========================================

export const IconSyringe = PiSyringeDuotone; // Inyectología
export const IconHeartbeat = PiHeartbeatDuotone; // Toma de tensión
export const IconDrop = PiDropDuotone; // Glicemia
export const IconTruck = HiOutlineTruck; // Domicilios
export const IconBeaker = HiOutlineBeaker; // Asesoría farmacéutica
export const IconClipboard = HiOutlineClipboardList; // Pedidos especiales
export const IconSupport = HiOutlineSupport; // Soporte

// ===========================================
// ICONOS DE ADMIN / DASHBOARD
// ===========================================

export const IconHome = HiOutlineHome;
export const IconProducts = PiPackageDuotone;
export const IconCategories = HiOutlineTag;
export const IconPromotions = HiOutlineGift;
export const IconOffer = BiSolidOffer;
export const IconServices = HiOutlineBeaker;
export const IconFAQ = HiOutlineQuestionMarkCircle;
export const IconLinks = HiOutlineLink;
export const IconUsers = HiOutlineUsers;
export const IconReports = HiOutlineChartBar;
export const IconDocuments = HiOutlineDocumentText;
export const IconFileText = HiOutlineDocumentText; // Alias para FileText
export const IconCalendar = HiOutlineCalendar;
export const IconLogout = HiOutlineLogout;
export const IconLogin = HiOutlineLogin;
export const IconUser = HiOutlineUser;
export const IconCog = HiOutlineCog;
export const IconMessage = HiOutlineAnnotation;

// ===========================================
// ICONOS DE VALORES / EMPRESA
// ===========================================

export const IconHandshake = PiHandshakeDuotone; // Confianza
export const IconHeart = HiOutlineHeart; // Compromiso
export const IconStar = HiOutlineStar; // Calidad
export const IconLightning = PiLightningDuotone; // Agilidad
export const IconTarget = PiTargetDuotone; // Misión
export const IconBinoculars = PiBinocularsDuotone; // Visión
export const IconRocket = PiRocketDuotone; // Innovación
export const IconMedal = PiMedalDuotone; // Excelencia
export const IconShield = HiOutlineShieldCheck; // Seguridad
export const IconSparkles = HiOutlineSparkles; // Destacado
export const IconStorefront = PiStorefrontDuotone; // Tienda
export const IconBuilding = HiOutlineOfficeBuilding; // Empresa

// ===========================================
// ICONOS ADICIONALES
// ===========================================

export const IconShoppingCart = PiShoppingCartDuotone;
export const IconCube = HiOutlineCube;
export const IconCollection = HiOutlineCollection;
export const IconGrid = HiOutlineViewGrid;

