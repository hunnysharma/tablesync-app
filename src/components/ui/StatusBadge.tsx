
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { TableStatus } from '@/utils/types';
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: TableStatus | 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled' | 'active' | 'completed' | 'paid';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return { bg: 'bg-status-available/10', text: 'text-status-available', label: 'Available' };
      case 'occupied':
        return { bg: 'bg-status-occupied/10', text: 'text-status-occupied', label: 'Occupied' };
      case 'reserved':
        return { bg: 'bg-status-reserved/10', text: 'text-status-reserved', label: 'Reserved' };
      case 'inactive':
        return { bg: 'bg-status-inactive/10', text: 'text-status-inactive', label: 'Inactive' };
      case 'pending':
        return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Pending' };
      case 'preparing':
        return { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Preparing' };
      case 'ready':
        return { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Ready' };
      case 'served':
        return { bg: 'bg-status-available/10', text: 'text-status-available', label: 'Served' };
      case 'cancelled':
        return { bg: 'bg-rose-500/10', text: 'text-rose-500', label: 'Cancelled' };
      case 'active':
        return { bg: 'bg-status-occupied/10', text: 'text-status-occupied', label: 'Active' };
      case 'completed':
        return { bg: 'bg-status-available/10', text: 'text-status-available', label: 'Completed' };
      case 'paid':
        return { bg: 'bg-status-available/10', text: 'text-status-available', label: 'Paid' };
      default:
        return { bg: 'bg-gray-500/10', text: 'text-gray-500', label: status };
    }
  };
  
  const { bg, text, label } = getStatusConfig();
  
  return (
    <Badge className={cn(
      "rounded-full capitalize font-medium",
      bg,
      text,
      className
    )}>
      {label}
    </Badge>
  );
}
