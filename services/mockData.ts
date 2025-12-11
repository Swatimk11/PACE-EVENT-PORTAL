import { Event, EventStatus, Hall } from "../types";

export const MOCK_CLUBS = [
  { id: 'club_ieee', name: 'IEEE Student Branch', email: 'ieee@pace.edu.in', avatar: 'https://ui-avatars.com/api/?name=IEEE&background=00629B&color=fff' },
  { id: 'club_glug', name: 'GLUG PACE', email: 'glug@pace.edu.in', avatar: 'https://ui-avatars.com/api/?name=GLUG&background=333&color=fff' },
  { id: 'club_embed', name: 'Embed Club', email: 'embed@pace.edu.in', avatar: 'https://ui-avatars.com/api/?name=Embed&background=Edbb11&color=fff' },
  { id: 'club_aces', name: 'ACES (CS Dept)', email: 'aces@pace.edu.in', avatar: 'https://ui-avatars.com/api/?name=ACES&background=2563eb&color=fff' },
  { id: 'club_force', name: 'FORCE (Civil Dept)', email: 'force@pace.edu.in', avatar: 'https://ui-avatars.com/api/?name=FORCE&background=dc2626&color=fff' },
  { id: 'club_cultural', name: 'PACE Cultural Club', email: 'cultural@pace.edu.in', avatar: 'https://ui-avatars.com/api/?name=Cultural&background=db2777&color=fff' },
  { id: 'club_sports', name: 'PACE Sports Association', email: 'sports@pace.edu.in', avatar: 'https://ui-avatars.com/api/?name=Sports&background=16a34a&color=fff' },
  { id: 'club_nss', name: 'NSS Unit', email: 'nss@pace.edu.in', avatar: 'https://ui-avatars.com/api/?name=NSS&background=ea580c&color=fff' },
  { id: 'club_edc', name: 'EDC (Entrepreneurship)', email: 'edc@pace.edu.in', avatar: 'https://ui-avatars.com/api/?name=EDC&background=7c3aed&color=fff' }
];

export const MOCK_STUDENTS: Record<string, string> = {
  '4PA21CS001': 'Aditya Rao',
  '4PA21CS045': 'Priya Shetty',
  '4PA21EC012': 'Mohammed Zaid',
  '4PA21ME033': 'Karthik Bhat',
  '4PA21CV008': 'Ananya Naik',
  '4PA21IS022': 'Rahul K',
  '4PA21CS101': 'Sneha Gupta'
};

export const INITIAL_EVENTS: Event[] = [
  {
    id: '1',
    title: 'PACE Tech Fest 2024',
    description: 'The annual technical symposium of P.A. College of Engineering featuring hackathons, coding contests, and robotics.',
    clubName: 'IEEE Student Branch',
    clubId: 'club_ieee',
    date: '2024-05-15',
    time: '09:00',
    location: 'PACE Auditorium',
    category: 'Technology',
    imageUrl: 'https://picsum.photos/seed/pacetech/800/600',
    capacity: 500,
    registeredCount: 350,
    status: EventStatus.APPROVED
  },
  {
    id: '2',
    title: 'Linux Install Fest',
    description: 'Learn how to install and configure various Linux distributions. Bring your laptops!',
    clubName: 'GLUG PACE',
    clubId: 'club_glug',
    date: '2024-06-20',
    time: '17:30',
    location: 'CS Seminar Hall',
    category: 'Workshop',
    imageUrl: 'https://picsum.photos/seed/linux/800/600',
    capacity: 100,
    registeredCount: 72,
    status: EventStatus.APPROVED
  },
  {
    id: '3',
    title: 'Embedded Systems Workshop',
    description: 'Hands-on workshop on Arduino and Raspberry Pi for beginners.',
    clubName: 'Embed Club',
    clubId: 'club_embed',
    date: '2024-04-10',
    time: '14:00',
    location: 'Electronics Lab',
    category: 'Technology',
    imageUrl: 'https://picsum.photos/seed/arduino/800/600',
    capacity: 60,
    registeredCount: 45,
    status: EventStatus.PENDING
  },
  {
    id: '4',
    title: 'Ethnic Day Celebration',
    description: 'A day to celebrate our rich cultural heritage. Come dressed in your traditional best! Features dance, music, and fashion show.',
    clubName: 'PACE Cultural Club',
    clubId: 'club_cultural',
    date: '2024-05-01',
    time: '10:00',
    location: 'PACE Ground',
    category: 'Cultural',
    imageUrl: 'https://picsum.photos/seed/ethnic/800/600',
    capacity: 2000,
    registeredCount: 1200,
    status: EventStatus.APPROVED
  },
  {
    id: '5',
    title: 'Inter-Department Cricket Tournament',
    description: 'The battle for the PACE Cup begins! Register your department teams now.',
    clubName: 'PACE Sports Association',
    clubId: 'club_sports',
    date: '2024-04-25',
    time: '09:00',
    location: 'College Ground',
    category: 'Sports',
    imageUrl: 'https://picsum.photos/seed/cricket/800/600',
    capacity: 200,
    registeredCount: 150,
    status: EventStatus.APPROVED
  },
  {
    id: '6',
    title: 'Mega Blood Donation Camp',
    description: 'Join hands to save lives. Organized in association with Red Cross Society.',
    clubName: 'NSS Unit',
    clubId: 'club_nss',
    date: '2024-04-15',
    time: '09:30',
    location: 'Main Block Lobby',
    category: 'Social Service',
    imageUrl: 'https://picsum.photos/seed/blood/800/600',
    capacity: 500,
    registeredCount: 120,
    status: EventStatus.APPROVED
  }
];

export const INITIAL_HALLS: Hall[] = [
  { id: 'h1', name: 'PACE Main Auditorium', capacity: 1200, facilities: ['Projector', 'Dolby Sound', 'Central AC'] },
  { id: 'h2', name: 'CS Seminar Hall', capacity: 150, facilities: ['Smart Board', 'AC', 'Video Conf'] },
  { id: 'h3', name: 'Mechanical Block AV Room', capacity: 100, facilities: ['Projector', 'Whiteboard'] },
  { id: 'h4', name: 'Admin Conference Hall', capacity: 50, facilities: ['TV Screen', 'Round Table'] },
  { id: 'h5', name: 'College Ground', capacity: 5000, facilities: ['PA System', 'Stage'] },
];