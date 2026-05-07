// HTTP Basic Auth via Vercel Edge Middleware.
// Runs on Vercel's edge BEFORE any static asset is served — real protection,
// not bypassable via DevTools or direct asset URLs.
//
// To change credentials, edit USER/PASS below and redeploy.
// (For production, prefer setting them via Vercel env vars.)

export const config = {
  matcher: '/:path*',
};

const USER = 'mpcraft';
const PASS = 'mpcraft2026';

export default function middleware(req) {
  const auth = req.headers.get('authorization');

  if (auth) {
    const parts = auth.split(' ');
    if (parts.length === 2 && parts[0] === 'Basic') {
      try {
        const decoded = atob(parts[1]);
        const sep = decoded.indexOf(':');
        const user = decoded.slice(0, sep);
        const pass = decoded.slice(sep + 1);
        if (user === USER && pass === PASS) {
          return; // pass through to static asset
        }
      } catch (_) {
        // fall through to 401
      }
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="MPCraft"',
      'Content-Type': 'text/plain; charset=UTF-8',
    },
  });
}
