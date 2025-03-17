
import React from 'react';
import { Sidebar } from './Sidebar';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex bg-background w-full">
        <Sidebar />
        <SidebarInset className="animate-fade-in">
          <div className="container py-6 max-w-7xl mx-auto">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export function PageHeader({ 
  title, 
  subtitle, 
  children 
}: { 
  title: string; 
  subtitle?: string; 
  children?: React.ReactNode 
}) {
  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4",
      "border-b border-border/40"
    )}>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 ml-auto">
          {children}
        </div>
      )}
    </div>
  );
}
