---
trigger: always_on
---

이 프로젝트는 이커머스 플랫폼 템플릿 제작 프로젝트입니다. 프로젝트 이름은 'sellpiece' 입니다. 사람들은 'sellpiece'를 다운로드 또는 클론하여 쉽게 이커머스 온라인 웹 쇼핑 서비스를 런칭할 수 있습니다. 프레임워크는 nextjs15 를 사용중입니다. 스타일링 도구로는 'tailwindcss'를 사용 중입니다. 배포는 'vercel'을 이용하며, 데이터베이스는 'supabase + postgres' 를 사용중입니다. orm은 'drizzle-orm'을 사용 중입니다.

페이지 그룹은 storefront와 admin 으로 구분됩니다. 함수형 프로그래밍을 지향하며 우아한 코드 설계를 적용해야 합니다. 보안과 최적화를 신경써야 합니다. 복잡한 기능보다는 단순하지만 필요한 기능은 다 있는 프로젝트를 지향합니다.

클라이언트 컴포넌트, 서버 컴포넌트, 서버 액션 등, 클라이언트와 서버의 바운더리를 명확히 하여 개발을 진행해야 합니다.

Mobile first design 준수.

## Project Architecture

- src/lib/db/schema.ts: db schema
- src/lib/db/queries: db queries
- src/lib/supabase: supabase client
- src/config: configuration of projects
- src/components: reusable components
- src/actions: server actions
- src/app: file based route
