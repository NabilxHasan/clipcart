import { NextResponse } from 'next/server';
import { ServerRepo } from '@/lib/db/server-repo';
import { hasAdminSession } from '@/lib/auth/require-admin';
import { getSessionUserId } from '@/lib/auth/user-session';
import { checkRateLimit, getClientIp } from '@/lib/auth/rate-limiter';

// All campaign / submission / wallet / withdrawal data goes through here (lib/db/repository.ts is the browser side).
// "user" actions act only on the clipper in the signed session cookie, never on an id sent by the browser;
// "admin" actions need the signed admin desk cookie.

type Access = 'public' | 'user' | 'admin';
type Ctx = { body: Record<string, any>; params: URLSearchParams; userId: string | null; ip: string }; // eslint-disable-line @typescript-eslint/no-explicit-any
type Handler = { method: 'GET' | 'POST'; access: Access; run: (ctx: Ctx) => Promise<unknown> };

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

const ACTIONS: Record<string, Handler> = {
  // public
  campaigns: { method: 'GET', access: 'public', run: ({ params }) => ServerRepo.getCampaigns(params.get('status') ?? undefined) },
  activeCampaigns: { method: 'GET', access: 'public', run: () => ServerRepo.getActiveCampaigns() },
  campaign: { method: 'GET', access: 'public', run: ({ params }) => ServerRepo.getCampaignBySlugOrId(params.get('id') ?? '') },
  whatsapp: { method: 'GET', access: 'public', run: () => ServerRepo.getWhatsAppSettings() },
  leaderboard: { method: 'GET', access: 'public', run: () => ServerRepo.getLeaderboard() },
  clientRequest: {
    method: 'POST',
    access: 'public',
    run: ({ body, ip }) => {
      const limit = checkRateLimit(`client-request:${ip}`, 3, 10 * 60 * 1000);
      if (!limit.allowed) throw new HttpError(429, `Too many requests. Please wait ${limit.retryAfterSec} seconds.`);
      return ServerRepo.createClientRequest(body as never);
    },
  },

  // signed-in clipper
  mySubmissions: { method: 'GET', access: 'user', run: ({ userId }) => ServerRepo.getSubmissions({ clipperId: userId! }) },
  myFinancials: { method: 'GET', access: 'user', run: ({ userId }) => ServerRepo.getClipperFinancials(userId!) },
  myClipperProfile: { method: 'GET', access: 'user', run: ({ userId }) => ServerRepo.getClipperProfile(userId!) },
  updateMyClipperProfile: { method: 'POST', access: 'user', run: ({ userId, body }) => ServerRepo.updateClipperProfile(userId!, body) },
  submit: {
    method: 'POST',
    access: 'user',
    run: ({ userId, body }) => {
      const limit = checkRateLimit(`submit:${userId}`, 10, 10 * 60 * 1000);
      if (!limit.allowed) throw new HttpError(429, `Too many submissions. Please wait ${limit.retryAfterSec} seconds.`);
      return ServerRepo.createSubmission(userId!, {
        campaignId: String(body.campaignId ?? ''),
        platform: body.platform,
        postUrl: String(body.postUrl ?? ''),
        caption: body.caption,
        notes: body.notes,
      });
    },
  },
  withdraw: {
    method: 'POST',
    access: 'user',
    run: ({ userId, body }) =>
      ServerRepo.requestWithdrawal(userId!, {
        amount: Number(body.amount),
        paymentMethod: body.paymentMethod,
        paymentIdentifier: String(body.paymentIdentifier ?? ''),
      }),
  },

  // admin desk
  adminSubmissions: {
    method: 'GET',
    access: 'admin',
    run: ({ params }) => ServerRepo.getSubmissions({ status: params.get('status') ?? undefined, campaignId: params.get('campaignId') ?? undefined }),
  },
  reviewSubmission: { method: 'POST', access: 'admin', run: ({ body }) => ServerRepo.reviewSubmission(body as never) },
  withdrawals: { method: 'GET', access: 'admin', run: ({ params }) => ServerRepo.getWithdrawalRequests(params.get('status') ?? undefined) },
  markWithdrawalPaid: { method: 'POST', access: 'admin', run: ({ body }) => ServerRepo.markWithdrawalPaid(body as never) },
  rejectWithdrawal: { method: 'POST', access: 'admin', run: ({ body }) => ServerRepo.rejectWithdrawal(body as never) },
  createCampaign: { method: 'POST', access: 'admin', run: ({ body }) => ServerRepo.createCampaign(body as never) },
  campaignPaymentReceived: {
    method: 'POST',
    access: 'admin',
    run: ({ body }) =>
      ServerRepo.markCampaignPaymentReceived(String(body.campaignId), Number(body.amount), body.paymentMethod, String(body.transactionReference ?? ''), body.adminNote),
  },
  paymentRecords: { method: 'GET', access: 'admin', run: () => ServerRepo.getPaymentRecords() },
  clientRequests: { method: 'GET', access: 'admin', run: () => ServerRepo.getClientRequests() },
  updateClientRequestStatus: {
    method: 'POST',
    access: 'admin',
    run: ({ body }) => ServerRepo.updateClientRequestStatus(String(body.id), body.status, body.adminNotes),
  },
  updateWhatsApp: { method: 'POST', access: 'admin', run: ({ body }) => ServerRepo.updateWhatsAppSettings(body) },
  auditLogs: { method: 'GET', access: 'admin', run: () => ServerRepo.getAuditLogs() },
  metrics: { method: 'GET', access: 'admin', run: () => ServerRepo.getAdminOverviewMetrics() },
};

async function handle(req: Request, action: string, method: 'GET' | 'POST') {
  const h = ACTIONS[action];
  if (!h || h.method !== method) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

  let userId: string | null = null;
  if (h.access === 'admin' && !(await hasAdminSession())) {
    return NextResponse.json({ success: false, error: 'Admin session required. Please sign in to the admin desk.' }, { status: 401 });
  }
  if (h.access === 'user') {
    userId = await getSessionUserId();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Your session has expired. Please log in again.', code: 'LOGIN_REQUIRED' }, { status: 401 });
    }
  }

  try {
    const body = method === 'POST' ? await req.json().catch(() => ({})) : {};
    const data = await h.run({ body: body ?? {}, params: new URL(req.url).searchParams, userId, ip: getClientIp(req) });
    return NextResponse.json({ success: true, data }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err: unknown) {
    const status = err instanceof HttpError ? err.status : 400;
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : 'Request failed' }, { status });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ action: string }> }) {
  return handle(req, (await params).action, 'GET');
}

export async function POST(req: Request, { params }: { params: Promise<{ action: string }> }) {
  return handle(req, (await params).action, 'POST');
}
