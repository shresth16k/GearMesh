import React from 'react';
import { TransactionStatus } from '../../types';

interface StatusBadgeProps {
  status: TransactionStatus;
}

const statusConfig: Record<TransactionStatus, { label: string; bg: string; color: string; border: string }> = {
  pending: {
    label: 'Pending Request',
    bg: '#FAF3E0',
    color: '#8C6226',
    border: '#E8DCB8'
  },
  approved: {
    label: 'Approved',
    bg: 'var(--color-pale-sage)',
    color: 'var(--color-deep-forest)',
    border: 'var(--color-muted-sage)'
  },
  active: {
    label: 'Active Borrow',
    bg: '#E3EDFA',
    color: '#1E477A',
    border: '#C2D9F7'
  },
  completed: {
    label: 'Completed',
    bg: '#EAF1EC',
    color: 'var(--color-success)',
    border: '#C8DDD0'
  },
  returned: {
    label: 'Returned',
    bg: '#F0ECE4',
    color: 'var(--color-muted-gray)',
    border: 'var(--color-soft-border)'
  },
  rejected: {
    label: 'Declined',
    bg: '#FBEBEB',
    color: 'var(--color-error)',
    border: '#ECC9C9'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: 600,
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        letterSpacing: '-0.01em',
        lineHeight: 1.2
      }}
    >
      {config.label}
    </span>
  );
};
