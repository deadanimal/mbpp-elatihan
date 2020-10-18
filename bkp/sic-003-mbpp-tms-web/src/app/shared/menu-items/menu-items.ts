export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    isCollapsed?: boolean;
    isCollapsing?: any;
    children?: ChildrenItems[];
}
  
export interface ChildrenItems {
    path: string;
    title: string;
    type?: string;
    collapse?: string;
    children?: ChildrenItems2[];
    isCollapsed?: boolean;
}

export interface ChildrenItems2 {
    path?: string;
    title?: string;
    type?: string;
}

// Menu Items

export const ROUTES: RouteInfo[] = [
  /*
  // Admin
  { path: '/admin/dashboard', title: 'Dashboard', type: 'link', icontype: 'fas fa-desktop text-primary'},
  { path: '/admin/plan', title: 'Calendar & Plan', type: 'link', icontype: 'far fa-calendar-alt text-info' },
  { path: '/admin/pengurusan', title: 'Pengurusan', type: 'link', icontype: 'fas fa-tasks text-pink' } 
  */
  // Penyelaras
  /*
  { path: '/penyelaras/dashboard', title: 'Dashboard', type: 'link', icontype: 'fas fa-desktop text-blue' },
  { path: '/penyelaras/kursus', title: 'Kursus', type: 'link', icontype: 'fas fa-chalkboard-teacher text-indigo'},
  { path: '/penyelaras/keperluan-kursus', title: 'Keperluan Kursus', type: 'link', icontype: 'fas fa-chart-pie text-gray' },
  //{ path: '/penyelaras/utiliti', title: 'Utiliti', type: 'link', icontype: 'fas fa-tools text-yellow' },
  { path: '/penyelaras/peperiksaan', title: 'Peperiksaan', type: 'link', icontype: 'fas fa-file-alt text-orange' },
  { path: '/penyelaras/pelan-operasi', title: 'Pelan Operasi', type: 'link', icontype: 'far fa-clipboard text-red' },
  { path: '/penyelaras/laporan', title: 'Laporan', type: 'link', icontype: 'fas fa-chart-bar text-green'}
  */
  // Kakitangan
  
  { path: '/kakitangan/profil', title: 'Profil', type: 'link', icontype: 'fas fa-user-circle text-red' },
  { path: '/kakitangan/kursus', title: 'Kursus', type: 'link', icontype: 'fas fa-chalkboard text-indigo'},
  { path: '/kakitangan/takwim-latihan', title: 'Takwim Latihan', type: 'link', icontype: 'far fa-calendar-alt text-green' },
  { path: '/kakitangan/survey', title: 'Survey Latihan', type: 'link', icontype: 'fas fa-poll text-blue' }
  
];

// System admin routes
export const AdminRoutes: RouteInfo[] = [
    { 
        path: '/kakitangan/dashboard', 
        title: 'Dashboard', 
        type: 'link', 
        icontype: 'fas fa-columns text-red' 
    },
    { path: '/kakitangan/takwim-latihan', title: 'Takwim', type: 'link', icontype: 'far fa-calendar-alt text-green' },
    { 
        path: '/kakitangan/kursus', 
        title: 'Kursus', 
        type: 'sub', 
        icontype: 'fas fa-chalkboard text-indigo',
        collapse: 'kursus',
        isCollapsed: true,
        children: [
            { path: 'senarai', title: 'Senarai Kursus Dibuka', type: 'link' },
            // { path: 'sejarah', title: 'Laporan Kehadiran Kursus', type: 'link' }
        ]
    },
    { path: '/kakitangan/survey', title: 'Survey Latihan', type: 'link', icontype: 'fas fa-poll text-blue' },
    { path: '/admin/dashboard', title: 'Dashboard Pentadbir', type: 'link', icontype: 'fas fa-desktop text-primary'},
    { path: '/admin/plan', title: 'Takwim', type: 'link', icontype: 'far fa-calendar-alt text-info' },
    { 
        path: '/admin/pengurusan', 
        title: 'Pengurusan', 
        type: 'sub', 
        icontype: 'fas fa-tasks text-pink',
        collapse: 'pengurusan',
        isCollapsed: true,
        children: [
            { path: 'senarai', title: 'Senarai Pengguna', type: 'link' },
            { path: 'tambah', title: 'Tambah Pengguna', type: 'link' },
            { path: 'log', title: 'Log', type: 'link' }
        ]
    } 
]

// Penyelaras routes
export const PenyelarasRoutes: RouteInfo[] = [
    { 
        path: '/kakitangan/dashboard', 
        title: 'Dashboard', 
        type: 'link', 
        icontype: 'fas fa-columns text-red' 
    },
    { path: '/kakitangan/takwim-latihan', title: 'Takwim', type: 'link', icontype: 'far fa-calendar-alt text-green' },
    { 
        path: '/kakitangan/kursus', 
        title: 'Kursus', 
        type: 'sub', 
        icontype: 'fas fa-chalkboard text-indigo',
        collapse: 'kursus',
        isCollapsed: true,
        children: [
            { path: 'senarai', title: 'Senarai Kursus Dibuka', type: 'link' },
            // { path: 'sejarah', title: 'Laporan Kehadiran Kursus', type: 'link' }
        ]
    },
    { path: '/kakitangan/survey', title: 'Survey Latihan', type: 'link', icontype: 'fas fa-poll text-blue' },
    { 
        path: '/penyelaras/dashboard', 
        title: 'Dashboard Latihan', 
        type: 'link', 
        icontype: 'fas fa-desktop text-blue' 
    },
    { 
        path: '/penyelaras/kursus', 
        title: 'Kursus', 
        type: 'sub', 
        icontype: 'fas fa-chalkboard-teacher text-indigo',
        collapse: 'kursus', 
        isCollapsed: true, 
        children: [
            { path: 'semasa', title: 'Kursus Semasa', type: 'link' },
            { path: 'tambah', title: 'Tambah Baru', type: 'link' },
            { path: 'sejarah', title: 'Kursus Sejarah', type: 'link' }
        ]
    },
    {
        path: '/penyelaras/keperluan-kursus', 
        title: 'Keperluan Kursus', 
        type: 'sub', 
        icontype: 'fas fa-chart-pie text-gray' ,
        collapse: 'keperluan-kursus',
        isCollapsed: true,
        children: [
            { path: 'overview', title: 'Overview', type: 'link' },
            // { path: 'tambah', title: 'Tambah', type: 'link' }
        ]
    },
   // { path: '/penyelaras/utiliti', title: 'Utiliti', type: 'link', icontype: 'fas fa-tools text-yellow' },
    { 
        path: '/penyelaras/peperiksaan', 
        title: 'Peperiksaan', 
        type: 'sub', 
        icontype: 'fas fa-file-alt text-orange' ,
        collapse: 'peperiksaan', 
        isCollapsed: true, 
        children: [
            { path: 'overview', title: 'Overview', type: 'link'  },
            { path: 'tambah', title: 'Tambah Baru', type: 'link' }
        ]
    },
    { 
        path: '/penyelaras/pelan-operasi', 
        title: 'Takwim', 
        type: 'link', 
        icontype: 'far fa-clipboard text-red' 
    },
    { 
        path: '/penyelaras/laporan', 
        title: 'Laporan', 
        type: 'link', 
        icontype: 'fas fa-chart-bar text-green'
    }
]

// Kakitangan routes
export const KakitanganRoutes: RouteInfo[] = [
    { 
        path: '/kakitangan/dashboard', 
        title: 'Dashboard', 
        type: 'link', 
        icontype: 'fas fa-columns text-red' 
    },
    { path: '/kakitangan/takwim-latihan', title: 'Takwim', type: 'link', icontype: 'far fa-calendar-alt text-green' },
    { 
        path: '/kakitangan/kursus', 
        title: 'Kursus', 
        type: 'sub', 
        icontype: 'fas fa-chalkboard text-indigo',
        collapse: 'kursus',
        isCollapsed: true,
        children: [
            { path: 'senarai', title: 'Senarai Kursus Dibuka', type: 'link' },
            // { path: 'sejarah', title: 'Laporan Kehadiran Kursus', type: 'link' }
        ]
    },
    { path: '/kakitangan/survey', title: 'Survey Latihan', type: 'link', icontype: 'fas fa-poll text-blue' }
]

// Penyelaras jabatan routes
export const JabatanRoutes: RouteInfo[] = [
    { 
        path: '/kakitangan/dashboard', 
        title: 'Dashboard', 
        type: 'link', 
        icontype: 'fas fa-columns text-red' 
    },
    { path: '/kakitangan/takwim-latihan', title: 'Takwim', type: 'link', icontype: 'far fa-calendar-alt text-green' },
    { 
        path: '/kakitangan/kursus', 
        title: 'Kursus', 
        type: 'sub', 
        icontype: 'fas fa-chalkboard text-indigo',
        collapse: 'kursus',
        isCollapsed: true,
        children: [
            { path: 'senarai', title: 'Senarai Kursus Dibuka', type: 'link' },
            // { path: 'sejarah', title: 'Laporan Kehadiran Kursus', type: 'link' }
        ]
    },
    { path: '/kakitangan/survey', title: 'Survey Latihan', type: 'link', icontype: 'fas fa-poll text-blue' },
    { path: '/penyelaras-jabatan/dashboard', title: 'Dashboard Jabatan', type: 'link', icontype: 'fas fa-columns text-red' },
    { 
        path: '/penyelaras-jabatan/kursus', 
        title: 'Kursus', 
        type: 'sub', 
        icontype: 'fas fa-chalkboard text-indigo',
        collapse: 'kursus', 
        isCollapsed: true, 
        children: [
            { path: 'senarai', title: 'Senarai', type: 'link' }
        ] 
    },
    { path: '/penyelaras-jabatan/laporan', title: 'Laporan', type: 'link', icontype: 'fas fa-chart-bar text-green' },
]

export const KetuaJabatanRoutes: RouteInfo[] = [
    { path: '/ketua-jabatan/dashboard', title: 'Dashboard', type: 'link', icontype: 'fas fa-columns text-red' },
    { path: '/ketua-jabatan/kursus/permohonan', title: 'Permohonan', type: 'link', icontype: 'fas fa-chalkboard text-indigo' }
]

export const PengarahJabatanRoutes: RouteInfo[] = [
    { path: '/pengarah-jabatan/dashboard', title: 'Dashboard', type: 'link', icontype: 'fas fa-columns text-red' },
    { path: '/pengarah-jabatan/kursus/permohonan', title: 'Permohonan', type: 'link', icontype: 'fas fa-chalkboard text-indigo' }
]

/*
{ path: '', title: '', type: 'link', icontype: '' }
*/