import { NextRequest, NextResponse } from 'next/server';

// ============ Types ============

type MiddlewareFn = (
  request: NextRequest,
  response: NextResponse
) => NextResponse | Response | undefined;

// ============ Composer ============

function composeMiddleware(...fns: MiddlewareFn[]) {
  return function middleware(request: NextRequest) {
    let response = NextResponse.next();

    for (const fn of fns) {
      const result = fn(request, response);

      if (result instanceof Response && result !== response) {
        return result;
      }

      if (result) {
        response = result as NextResponse;
      }
    }

    return response;
  };
}

// ============ Middleware Functions ============

function withSecurityHeaders(request: NextRequest, response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  return response;
}

function withAuth(request: NextRequest, response: NextResponse) {
  const token = request.cookies.get('authjs.session-token')?.value;

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

// ============ Export ============

export const middleware = composeMiddleware(withSecurityHeaders, withAuth);

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
