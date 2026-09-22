/**
 * Sample data for RadarPlanes
 * Categories: sport, board, party, study
 */

export const CATEGORIES = [
  { id: 'all', label: 'Todos', emoji: '🔥' },
  { id: 'sport', label: 'Pichanga', emoji: '⚽' },
  { id: 'board', label: 'Cartas', emoji: '🎲' },
  { id: 'party', label: 'Fiesta', emoji: '🎉' },
  { id: 'study', label: 'Estudio', emoji: '📚' }
];

export const CATEGORY_FORM = [
  { id: 'sport', label: 'Pichanga', emoji: '⚽', desc: 'Fútbol, vóley, basket' },
  { id: 'board', label: 'Cartas', emoji: '🎲', desc: 'Catan, UNO, poker' },
  { id: 'party', label: 'Fiesta', emoji: '🎉', desc: 'Previa, terraza, JBL' },
  { id: 'study', label: 'Estudio', emoji: '📚', desc: 'Repaso, grupo, pizarra' }
];

export const RADIUS_OPTIONS = [
  { step: 0, label: '500m', desc: '500m (~7 min caminando)', ring: 'w-16 h-16', sub: 'Pabellones' },
  { step: 1, label: '1 km', desc: '1.0 km (~15 min caminando)', ring: 'w-24 h-24', sub: 'Campus' },
  { step: 2, label: '3 km', desc: '3.0 km (~10 min bici)', sub: 'Alrededores' },
  { step: 3, label: '5 km', desc: '5.0 km (Distrito)', sub: 'Distrito' }
];

export const SUGGESTED_TITLES = [
  'Faltan 2 para pichanga 6v6',
  'Mesa de Catan en cafetería',
  'Previa post-parciales Terraza D',
  'Repaso Física II intensivo'
];

const AVATAR_AVAILABLE = false; // Use UI Avatars (deterministic)
function avatarUrl(name, color = '40efb7') {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${color}&color=0b1326&bold=true&size=128`;
}

export const SEED_PLANS = [
  {
    id: 'plan-1',
    title: 'Faltan 2 para completar el 6v6 mixto',
    description: 'Llevar polo blanco o negro. Tenemos guantes de arquero y agua helada.',
    category: 'sport',
    distance: 120,
    location: 'Cancha Sintética 2',
    capacity: 12,
    attendees: 10,
    startsIn: '15 min',
    urgent: false,
    host: { name: 'Juan Pérez', career: 'Ing. Sistemas', avatar: avatarUrl('Juan Perez', '40efb7') },
    verifiedTag: '@juan_ing',
    image: ''
  },
  {
    id: 'plan-2',
    title: 'Mesa de Catan y UNO! Traigan snacks',
    description: 'Estamos en las mesas redondas del fondo junto a la terraza con sombra.',
    category: 'board',
    distance: 280,
    location: 'Cafetería Central',
    capacity: 5,
    attendees: 4,
    startedAgo: '10m',
    urgent: true,
    host: { name: 'María López', career: 'Diseño', avatar: avatarUrl('Maria Lopez', 'ffb95f') },
    image: ''
  },
  {
    id: 'plan-3',
    title: 'Previa post-parciales de Cálculo! Ponemos parlante JBL',
    description: 'Depa piso 4 a 1 cuadra. Cervezas frías y buena música para despejarse.',
    category: 'party',
    distance: 450,
    location: 'Puerta 3 · Terraza D',
    capacity: 20,
    attendees: 14,
    startsAt: '8:30 PM (en 45 min)',
    liveOn: 'TikTok Live',
    urgent: false,
    host: { name: 'Sofía R.', career: 'Física II', avatar: avatarUrl('Sofia R', '54fdc4') },
    image: ''
  },
  {
    id: 'plan-4',
    title: 'Repaso Intensivo Física II para el examen de mañana',
    description: 'Revisando exámenes pasados de Termodinámica y Ondas con pizarra limpia.',
    category: 'study',
    distance: 600,
    location: 'Biblioteca · Cubículo 402',
    capacity: 6,
    attendees: 3,
    startsIn: 'Ahora',
    urgent: false,
    host: { name: 'Carlos M.', career: 'Ing. Mecánica', avatar: avatarUrl('Carlos M', '8083ff') },
    image: ''
  },
  {
    id: 'plan-5',
    title: 'Vóley mixto en cancha 3',
    description: 'Buscamos 4 personas más, todos los niveles bienvenidos.',
    category: 'sport',
    distance: 320,
    location: 'Cancha 3',
    capacity: 10,
    attendees: 6,
    startsIn: '30 min',
    urgent: false,
    host: { name: 'Diego R.', career: 'Ing. Civil', avatar: avatarUrl('Diego R', '40efb7') },
    image: ''
  },
  {
    id: 'plan-6',
    title: 'Noche de poker y tragos',
    description: 'Mesa pequeña, ambiente tranquilo. Aporte de S/ 5 para snacks.',
    category: 'board',
    distance: 800,
    location: 'Terraza Dpto 4B',
    capacity: 6,
    attendees: 5,
    startsIn: '1 hora',
    urgent: false,
    host: { name: 'Lucía P.', career: 'Administración', avatar: avatarUrl('Lucia P', 'ffb95f') },
    image: ''
  }
];

export const SAFETY_TIPS = [
  {
    id: 1,
    icon: 'location_city',
    accent: 'secondary',
    title: 'Zonas Concurridas Siempre',
    body: 'Reúnete en puntos comunes del campus: canchas deportivas, cafetería central, biblioteca o plazas abiertas bien iluminadas.'
  },
  {
    id: 2,
    icon: 'photo_camera',
    accent: 'primary',
    title: 'Verifica Evidencias',
    body: 'Revisa siempre la story de Instagram o el TikTok Live antes de asistir a previas o reuniones fuera de la facultad.'
  },
  {
    id: 3,
    icon: 'lock_person',
    accent: 'error',
    title: 'Privacidad y Respeto',
    body: 'Nunca compartas claves institucionales ni datos bancarios. Reporta planes sospechosos de inmediato con el botón de seguridad.'
  }
];

export const PROFILE = {
  name: 'Valeria Herrera',
  email: '@ucentral.edu',
  faculty: 'Facultad de Ingeniería',
  verified: true
};

export const SAVED_FILTERS = [
  { id: 'created', label: 'Creados por mí', icon: 'bolt', count: 2 },
  { id: 'joined', label: 'Me Sumé', icon: 'groups', count: 1 }
];