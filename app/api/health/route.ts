import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const start = Date.now();
    const { error } = await supabaseAdmin.from('profiles').select('id').limit(1);
    const latencyMs = Date.now() - start;

    if (error) {
      return NextResponse.json({
        status: 'degraded',
        database: 'error',
        message: error.message,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      latencyMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    return NextResponse.json({
      status: 'error',
      message: err instanceof Error ? err.message : 'Health check failed',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
