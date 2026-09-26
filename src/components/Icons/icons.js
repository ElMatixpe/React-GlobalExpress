// Iconos SVG simples, sin librerías externas
export const HomeIcon = ({ color = '#fff', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <path d="M4 11.5 12 5l8 6.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 10v9h12v-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TagIcon = ({ color = '#fff', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <path d="M12 3h6a2 2 0 0 1 2 2v6l-9.5 9.5a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L12 3Z" strokeLinejoin="round" />
    <circle cx="15.5" cy="7.5" r="1.3" fill={color} stroke="none" />
  </svg>
);

export const BoxIcon = ({ color = '#fff', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <path d="M3.5 7 12 3l8.5 4v10L12 21l-8.5-4Z" strokeLinejoin="round" />
    <path d="M3.5 7 12 11l8.5-4M12 11v10" strokeLinejoin="round" />
  </svg>
);

export const UsersIcon = ({ color = '#fff', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.4 2.7-6 6-6s6 2.6 6 6" strokeLinecap="round" />
    <path d="M15.5 6.2c1.4.3 2.5 1.6 2.5 3.1s-1.1 2.8-2.5 3.1M18 14.3c2 .5 3.5 2.4 3.5 4.7" strokeLinecap="round" />
  </svg>
);

export const ReportIcon = ({ color = '#fff', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 13v4M12 9v8M16 11v6" strokeLinecap="round" />
  </svg>
);

export const LogoutIcon = ({ color = '#fff', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <path d="M9 20H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 16l4-4-4-4M20 12H9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UserPlusIcon = ({ color = '#c0392b', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <circle cx="10" cy="8" r="4" />
    <path d="M2.5 20c0-4 3.4-7 7.5-7s7.5 3 7.5 7" strokeLinecap="round" />
    <path d="M19 8v4M21 10h-4" strokeLinecap="round" />
  </svg>
);

export const SearchIcon = ({ color = '#777', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
  </svg>
);

export const ChevronDownIcon = ({ color = '#333', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const UserIconLogin = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.8">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
  </svg>
);

export const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.8">
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeLinecap="round" />
  </svg>
);

export const PhoneIcon = ({ color = '#666', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <path
      d="M4 5c0-1 .8-1.5 1.5-1.5H8c.4 0 .8.3.9.7l1 3.4c.1.4 0 .8-.3 1.1L8.2 10c1 2.3 2.8 4.1 5 5.1l1.3-1.4c.3-.3.7-.4 1.1-.3l3.4 1c.4.1.7.5.7.9v2.5c0 .8-.6 1.5-1.5 1.5C11.4 19.3 4.7 12.6 4 5Z"
      strokeLinejoin="round"
    />
  </svg>
);

export const MailIcon = ({ color = '#666', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M4 6.5 12 13l8-6.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EyeIcon = ({ color = '#c0392b', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = ({ color = '#c0392b', size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
    <path
      d="M3 3l18 18M9.9 5.2C10.6 5.1 11.3 5 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.4 4.3M6.5 6.6C4 8.3 2 12 2 12s3.6 7 10 7c1.4 0 2.6-.3 3.7-.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);