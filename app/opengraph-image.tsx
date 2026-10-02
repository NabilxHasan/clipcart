import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'ClipCart — Bangladesh Content Clipping & Distribution Marketplace';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
          backgroundColor: '#fafafc',
          backgroundImage: 'radial-gradient(rgba(225, 29, 72, 0.18) 2px, transparent 2px)',
          backgroundSize: '28px 28px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar with Badge */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                backgroundColor: '#e11d48',
                border: '4px solid #09090b',
                boxShadow: '4px 4px 0px #09090b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 28,
              }}
            >
              ▶
            </div>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#09090b', letterSpacing: '-1px' }}>
              Clip<span style={{ color: '#e11d48' }}>Cart</span>
            </div>
          </div>
          <div
            style={{
              padding: '10px 20px',
              backgroundColor: '#09090b',
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
              fontSize: 60,
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#09090b',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            Turn Great Content Into Viral Distribution.
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#52525b',
              maxWidth: 950,
              lineHeight: 1.4,
              fontWeight: 500,
            }}
          >
            Connecting brands, podcasters & founders with skilled video clippers in Bangladesh. 
            Pay per 1,000 verified views • Direct bKash payouts.
          </div>
        </div>

        {/* Bottom Feature Pills */}
        <div style={{ display: 'flex', gap: 16 }}>
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#ffffff',
              border: '3px solid #09090b',
              borderRadius: 14,
              boxShadow: '4px 4px 0px #09090b',
              fontSize: 18,
              fontWeight: 800,
              color: '#09090b',
            }}
          >
            🔥 ৳1,000 Micro-Campaigns
          </div>
          <div
            style={{
              padding: '12px 24px',
              backgroundColor: '#e11d48',
              border: '3px solid #09090b',
              borderRadius: 14,
              boxShadow: '4px 4px 0px #09090b',
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
              backgroundColor: '#ffffff',
              border: '3px solid #09090b',
              borderRadius: 14,
              boxShadow: '4px 4px 0px #09090b',
              fontSize: 18,
              fontWeight: 800,
              color: '#09090b',
            }}
          >
            🛡️ 100% Human-Audited Views
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
