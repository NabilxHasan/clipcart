import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ClipCart — Bangladesh Content Clipping & Distribution Marketplace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          backgroundColor: '#0c0d10',
          backgroundImage: 'radial-gradient(rgba(244, 63, 94, 0.25) 2px, transparent 2px)',
          backgroundSize: '28px 28px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar with Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: '#e11d48',
                border: '4px solid #ffffff',
                boxShadow: '4px 4px 0px #000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 28,
              }}
            >
              ▶
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', letterSpacing: '-1px' }}>
              Clip<span style={{ color: '#f43f5e' }}>Cart</span>
            </div>
          </div>
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: '#f43f5e',
              color: 'white',
              borderRadius: 999,
              fontSize: 15,
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            BANGLADESH CONTENT DISTRIBUTION
          </div>
        </div>

        {/* Center Main Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#ffffff',
            }}
          >
            Turn Long-Form Videos Into Viral Shorts.
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#a1a1aa',
              maxWidth: 950,
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            Performance-driven clipping campaigns for Bangladeshi creators & brands. 
            Flexible ৳1,000 campaigns • ৳50 min cashout via bKash.
          </div>
        </div>

        {/* Bottom Feature Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#18181b',
              border: '3px solid #27272a',
              borderRadius: 14,
              boxShadow: '4px 4px 0px #000000',
              fontSize: 18,
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            🔥 ৳1,000 Micro-Campaigns
          </div>
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#e11d48',
              border: '3px solid #ffffff',
              borderRadius: 14,
              boxShadow: '4px 4px 0px #000000',
              fontSize: 18,
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            💰 ৳50 Min Cashout • 0% Fee
          </div>
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#18181b',
              border: '3px solid #27272a',
              borderRadius: 14,
              boxShadow: '4px 4px 0px #000000',
              fontSize: 18,
              fontWeight: 800,
              color: '#ffffff',
            }}
          >
            🛡️ 100% Real Audited Views
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
