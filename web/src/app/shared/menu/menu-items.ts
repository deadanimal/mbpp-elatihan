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
// Staff / Kakitangan
export const STROUTES: RouteInfo[] = [ 
  { path: '/dashboard', title: 'Dashboard', type: 'link', icontype: 'fas fa-desktop text-primary' },
  { path: '/trainings',  title: 'Latihan', type: 'sub', icontype: 'fas fa-chalkboard-teacher text-primary',
    collapse: 'trainings', isCollapsed: true, children: [
      { path: 'summary', title: 'Ringkasan', type: 'link' },
      { path: 'list', title: 'Senarai Semasa', type: 'link' },
      { path: 'history', title: 'Senarai Sejarah', type: 'link' }
    ]
  },
  { path: '/exams',  title: 'Peperiksaan', type: 'sub', icontype: 'fas fa-list-alt text-primary',
    collapse: 'exams', isCollapsed: true, children: [
      { path: 'summary', title: 'Ringkasan', type: 'link' },
      { path: 'add', title: 'Tambah', type: 'link' }
    ]
  },
  { path: '/need-analysis', title: 'Keperluan Latihan', type: 'link', icontype: 'fas fa-chart-pie text-primary'},
  { path: '/takwim',  title: 'Takwim', type: 'link', icontype: 'far fa-calendar-alt text-primary' }
];
// Training Coordinator / Penyelaras Latihan
export const TCROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', type: 'link', icontype: 'fas fa-desktop text-primary' },
  { path: '/trainings',  title: 'Latihan', type: 'sub', icontype: 'fas fa-chalkboard-teacher text-primary',
    collapse: 'trainings', isCollapsed: true, children: [
      { path: 'summary', title: 'Ringkasan', type: 'link' },
      { path: 'list', title: 'Senarai Semasa', type: 'link' },
      { path: 'history', title: 'Senarai Sejarah', type: 'link' }
    ]
  },
  { path: '/exams',  title: 'Peperiksaan', type: 'sub', icontype: 'fas fa-list-alt text-primary',
    collapse: 'exams', isCollapsed: true, children: [
      { path: 'summary', title: 'Ringkasan', type: 'link' },
      { path: 'add', title: 'Tambah', type: 'link' }
    ]
  },
  { path: '/need-analysis', title: 'Keperluan Latihan', type: 'link', icontype: 'fas fa-chart-pie text-primary'},
  { path: '/takwim',  title: 'Takwim', type: 'link', icontype: 'far fa-calendar-alt text-primary' },
  { path: '/tc/dashboard', title: 'Dashboard Latihan', type: 'link', icontype: 'fas fa-home text-primary'
  },
  { path: '/tc/trainings',  title: 'Pengurusan Latihan', type: 'sub', icontype: 'fas fa-chalkboard-teacher text-primary',
    collapse: 'trainings', isCollapsed: true, children: [
      { path: 'summary', title: 'Ringkasan', type: 'link' },
      { path: 'add', title: 'Tambah', type: 'link' },
      // { path: '', title: '', type: 'link' }
    ]
  },
  { path: '/tc/exams', title: 'Pengurusan Peperiksaan', type: 'sub', icontype: 'fas fa-list-alt text-primary',
    collapse: 'exams', isCollapsed: true, children: [
      { path: 'summary', title: 'Ringkasan', type: 'link' },
      { path: 'add', title: 'Tambah', type: 'link' }
    ]
  },
  { path: '/tc/need-analyses', title: 'Analisa Keperluan Latihan', type: 'link', icontype: 'fas fa-chart-pie text-primary' },
  { path: '/tc/report', title: 'Laporan', type: 'link', icontype: 'fas fa-chart-bar text-primary' },
  { path: '/tc/configuration', title: 'Konfigurasi', type: 'link', icontype: 'fas fa-tools text-primary' }
];
// Department Coordinator / Penyelaras Jabatan
export const DCROUTES: RouteInfo[] = [ 
  { path: '/dashboard', title: 'Dashboard', type: 'link', icontype: 'fas fa-desktop text-primary' },
  { path: '/trainings',  title: 'Latihan', type: 'sub', icontype: 'fas fa-chalkboard-teacher text-primary',
    collapse: 'trainings', isCollapsed: true, children: [
      { path: 'summary', title: 'Ringkasan', type: 'link' },
      { path: 'list', title: 'Senarai Semasa', type: 'link' },
      { path: 'history', title: 'Senarai Sejarah', type: 'link' }
    ]
  },
  { path: '/exams',  title: 'Peperiksaan', type: 'sub', icontype: 'fas fa-list-alt text-primary',
    collapse: 'exams', isCollapsed: true, children: [
      { path: 'summary', title: 'Ringkasan', type: 'link' },
      { path: 'add', title: 'Tambah', type: 'link' }
    ]
  },
  { path: '/need-analysis', title: 'Keperluan Latihan', type: 'link', icontype: 'fas fa-chart-pie text-primary'},
  { path: '/takwim',  title: 'Takwim', type: 'link', icontype: 'far fa-calendar-alt text-primary' }
];
// Admin / Pentadbir
export const ADROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', type: 'link', icontype: 'fas fa-desktop text-primary' },
  { path: '/trainings',  title: 'Latihan', type: 'sub', icontype: 'fas fa-chalkboard-teacher text-primary',
    collapse: 'trainings', isCollapsed: true, children: [
      { path: 'summary', title: 'Ringkasan', type: 'link' },
      { path: 'list', title: 'Senarai Semasa', type: 'link' },
      { path: 'history', title: 'Senarai Sejarah', type: 'link' }
    ]
  },
  { path: '/exams',  title: 'Peperiksaan', type: 'sub', icontype: 'fas fa-list-alt text-primary',
    collapse: 'exams', isCollapsed: true, children: [
      { path: 'summary', title: 'Ringkasan', type: 'link' },
      { path: 'add', title: 'Tambah', type: 'link' }
    ]
  },
  { path: '/need-analysis', title: 'Keperluan Latihan', type: 'link', icontype: 'fas fa-chart-pie text-primary'},
  { path: '/takwim',  title: 'Takwim', type: 'link', icontype: 'far fa-calendar-alt text-primary' },
  { path: '/admin/dashboard', title: 'Dashboard', type: 'link', icontype: 'fas fa-home text-primary' },
  { path: '/admin/management', title: 'Management', type: 'sub', icontype: 'fas fa-file-invoice text-primary', 
    collapse: 'management', isCollapsed: true, children: [
      { path: 'audit-trails', title: 'Audit Trails', type: 'link' },
      { path: 'user', title: 'User', type: 'link' }
    ]
  },
  { path: '/admin/report', title: 'Reporting', type: 'link', icontype: 'fas fa-chart-bar text-primary' },
];