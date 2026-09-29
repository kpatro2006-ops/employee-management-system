export function getInitials(name = '') {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatSalary(amount) {
  if (!amount && amount !== 0) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const d = new Date(dateString);
  return isNaN(d.getTime()) ? 'N/A' : d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Consistent color palette for avatar backgrounds
const AVATAR_COLORS = [
  '#4f46e5', '#2563eb', '#0891b2', '#0d9488',
  '#059669', '#d97706', '#dc2626', '#7c3aed',
  '#db2777', '#475569'
];

export function getAvatarColor(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getDepartmentBadge(dept = '') {
  const normalized = dept.toLowerCase();
  if (normalized.includes('engineer') || normalized.includes('tech')) return 'badge-dept-tech';
  if (normalized.includes('product')) return 'badge-dept-product';
  if (normalized.includes('design')) return 'badge-dept-design';
  if (normalized.includes('hr') || normalized.includes('human')) return 'badge-dept-hr';
  if (normalized.includes('market')) return 'badge-dept-marketing';
  if (normalized.includes('sale')) return 'badge-dept-sales';
  if (normalized.includes('finance')) return 'badge-dept-finance';
  return 'badge-dept-default';
}

export function getStatusBadge(status = 'Active') {
  switch (status) {
    case 'Active':
      return 'badge-status-active';
    case 'On Leave':
      return 'badge-status-leave';
    case 'Inactive':
      return 'badge-status-inactive';
    default:
      return 'badge-status-default';
  }
}
