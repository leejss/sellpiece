import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { env } from "@env/client";
import { User } from "@supabase/supabase-js";

export async function middleware(request: NextRequest) {
  // /admin 하위 경로만 검사 (matcher로 제한되지만 가독성을 위해 명시)
  const { pathname } = new URL(request.url);
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  // 로그인 페이지는 보호 예외 처리 (루프 방지)
  if (pathname === "/admin/login") return NextResponse.next();

  const response = NextResponse.next();
  // 미들웨어에서 Supabase 클라이언트 직접 생성
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

  // 세션 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 비로그인 사용자는 로그인 페이지로
  if (!user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 이메일이 없으면 접근 불가 처리 (비정상 계정)
  if (!user.email) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // 관리자 여부 확인: app_metadata에서 빠르게 체크
  if (!isAdminFromToken(user)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

function isAdminFromToken(user: User | null): boolean {
  if (!user) return false;
  return user.app_metadata?.isAdmin === true;
}
