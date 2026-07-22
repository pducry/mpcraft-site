// HTTP Basic Auth via Vercel Edge Middleware.
// Runs on Vercel's edge BEFORE any static asset is served — real protection,
// not bypassable via DevTools or direct asset URLs.
//
// Senhas configuradas via variáveis de ambiente no Vercel:
//   PASS_CAROLINA, PASS_MARCELA, PASS_MELANIE, PASS_NATALI, PASS_RAFAEL

export const config = {
  matcher: '/:path*',
};

const CREDENTIALS = {
  '/lideranca/carolina.html': { user: 'carolina', pass: process.env.PASS_CAROLINA },
  '/lideranca/marcela.html':  { user: 'marcela',  pass: process.env.PASS_MARCELA  },
  '/lideranca/melanie.html':  { user: 'melanie',  pass: process.env.PASS_MELANIE  },
  '/lideranca/natali.html':   { user: 'natali',   pass: process.env.PASS_NATALI   },
  '/lideranca/rafael.html':   { user: 'rafael',   pass: process.env.PASS_RAFAEL   },
};

export default function middleware(req) {
  const url = new URL(req.url);
  const cred = CREDENTIALS[url.pathname];

  if (!cred) return; // página pública

  const auth = req.headers.get('authorization');
  if (auth) {
    const parts = auth.split(' ');
    if (parts.length === 2 && parts[0] === 'Basic') {
      try {
        const decoded = atob(parts[1]);
        const sep = decoded.indexOf(':');
        const user = decoded.slice(0, sep);
        const pass = decoded.slice(sep + 1);
        if (user === cred.user && pass === cred.pass) {
          return; // acesso liberado
        }
      } catch (_) {
        // fall through to 401
      }
    }
  }

  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${cred.user}"`,
      'Content-Type': 'text/plain; charset=UTF-8',
    },
  });
}
