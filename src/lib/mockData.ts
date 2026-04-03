export const MOCK_PROJECTS = [
  {
    id: '1',
    name: 'Caminos de Hierro',
    code: 'CH-2024',
    client: 'Renfe',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-06-30',
    type: 'Comercial',
    description: 'Campaña nacional de verano para nuevos trayectos.'
  },
  {
    id: '2',
    name: 'Sombras del Mañana',
    code: 'SM-2024',
    client: 'Netflix',
    status: 'draft',
    startDate: '2024-05-15',
    endDate: '2024-09-20',
    type: 'Serie TV',
    description: 'Thriller psicológico ambientado en el centro histórico.'
  },
  {
    id: '3',
    name: 'Destello Real',
    code: 'DR-2024',
    client: 'Estée Lauder',
    status: 'completed',
    startDate: '2024-01-10',
    endDate: '2024-02-28',
    type: 'Fashion Film',
    description: 'Promoción de nueva línea de fragancias premium.'
  }
];

export const MOCK_TASKS = [
  {
    id: '101',
    projectId: '1',
    title: 'Permiso de rodaje en Estación Atocha',
    assignedTo: 'Carlos Productor',
    status: 'pending',
    priority: 'high',
    dueDate: '2024-03-15'
  },
  {
    id: '102',
    projectId: '1',
    title: 'Contratación de catering para equipo técnico',
    assignedTo: 'Marta Coord',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2024-03-20'
  },
  {
    id: '103',
    projectId: '2',
    title: 'Scouting de locación sótano industrial',
    assignedTo: 'Jorge Locs',
    status: 'completed',
    priority: 'high',
    dueDate: '2024-03-05'
  }
];

export const MOCK_CASTING = [
  {
    id: '201',
    fullName: 'Elena Martínez',
    ageRange: '25-30',
    height: 172,
    city: 'Madrid',
    skills: 'Danza contemporánea, Canto',
    status: 'approved',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop'
  },
  {
    id: '202',
    fullName: 'David Soto',
    ageRange: '35-45',
    height: 185,
    city: 'Barcelona',
    skills: 'Boxeo, Conducción avanzada',
    status: 'shortlisted',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'
  },
  {
    id: '203',
    fullName: 'Isabel Ruiz',
    ageRange: '18-22',
    height: 165,
    city: 'Valencia',
    skills: 'Idiomas (EN, FR, DE)',
    status: 'new',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop'
  }
];

export const MOCK_LOCATIONS = [
  {
    id: '301',
    name: 'Palacio Vergara',
    type: 'Mansión histórica',
    city: 'Segovia',
    owner: 'Familia Velalcázar',
    status: 'approved',
    photos: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=400&fit=crop'],
    notes: 'Excelente luz natural por las mañanas.'
  },
  {
    id: '302',
    name: 'Sótano La Central',
    type: 'Industrial/Underground',
    city: 'Madrid',
    owner: 'Naves Industriales SA',
    status: 'visited',
    photos: ['https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&h=400&fit=crop'],
    notes: 'Requiere generador eléctrico propio.'
  }
];

export const MOCK_ACTIVITY = [
  { id: '1', actor: 'Carlos Productor', action: 'creó la tarea', target: 'Permiso Atocha', time: 'hace 2 horas' },
  { id: '2', actor: 'Marta Coord', action: 'subió 3 fotos a', target: 'Palacio Vergara', time: 'hace 5 horas' },
  { id: '3', actor: 'Jorge Locs', action: 'marcó como pre-aprobada a', target: 'Elena Martínez', time: 'ayer' },
  { id: '4', actor: 'Admin', action: 'actualizó el estado del proyecto', target: 'Caminos de Hierro', time: 'ayer' }
];
