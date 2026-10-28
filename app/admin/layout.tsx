import React from 'react';
import type { Metadata } from 'next';
import { AdminAuthGate } from '../../components/admin/AdminAuthGate';
import { AdminShell } from '../../components/admin/AdminShell';
import { hasAdminSession } from '../../lib/auth/require-admin';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Checked per request on the server: without a valid signed session only the passcode gate is rendered.
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!(await hasAdminSession())) {
    return <AdminAuthGate />;
  }
  return <AdminShell>{children}</AdminShell>;
}
