import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { env } from '@env/client';
import { User } from '@supabase/supabase-js';

const USER_PROTECTED_ROUTE = ['/cart'];
const ADMIN_PROTECTED_ROUTE = ['/admin'];

function isUserProtectedRoute(pathname: string) {
  return USER_PROTECTED_ROUTE.some((r) => pathname.startsWith(r));
}

function isAdminProtectedRoute(pathname: string) {
  return ADMIN_PROTECTED_ROUTE.some((r) => pathname.startsWith(r));
}

function getPathname(request: NextRequest) {
  const { pathname } = new URL(request.url);
  return pathname;
}

export async function middleware(request: NextRequest) {
  // /admin 하위 경로만 검사 (matcher로 제한되지만 가독성을 위해 명시)
  const pathname = getPathname(request);
  const response = NextResponse.next();
  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          } catch {
            // 미들웨어 컨텍스트에서 setAll 실패는 무시 가능
          }
        },
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (isAdminProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    if (isUserProtectedRoute(pathname)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 인증 + check admin
  const isAdmin = isAdminFromToken(user);
  if (isAdminProtectedRoute(pathname) && !isAdmin) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

function isAdminFromToken(user: User | null): boolean {
  if (!user) return false;
  return user.app_metadata?.isAdmin === true;
}
