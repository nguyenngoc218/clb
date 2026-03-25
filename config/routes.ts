export default [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    name: 'Bảng điều khiển',
    path: '/dashboard',
    icon: 'dashboard',
    component: './Dashboard', // Đường dẫn tới pages/Dashboard/index.tsx
  },
  {
    name: 'Quản lý Câu lạc bộ',
    path: '/clubs',
    icon: 'deploymentUnit',
    component: './Club',      // Đường dẫn tới pages/Club/index.tsx
  },
  {
    name: 'Đơn đăng ký',
    path: '/registrations',
    icon: 'form',
    component: './Registration', // Đường dẫn tới pages/Registration/index.tsx
  },
  {
    name: 'Thành viên chính thức',
    path: '/members',
    icon: 'team',
    component: './Members',      // Đường dẫn tới pages/Members/index.tsx
  },
];