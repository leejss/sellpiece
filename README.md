# Sellpiece

이커머스 플랫폼 템플릿 프로젝트입니다. Next.js 15, Supabase, Drizzle ORM을 사용합니다.

## 초기 설정

### 1. 환경변수 설정

```bash
cp env.example .env
```

`.env` 파일을 열어 다음 값들을 설정하세요:

- Supabase 프로젝트 URL 및 키
- 데이터베이스 연결 정보
- `ADMIN_PROVISION_SECRET` (랜덤 문자열 생성 권장)

```bash
# 시크릿 생성 예시
openssl rand -base64 32
```

### 2. 데이터베이스 마이그레이션

```bash
npm run db:push
```

### 3. 초기 관리자 계정 생성

```bash
npm run admin:create
```

대화형 프롬프트에서 관리자 이메일과 정보를 입력하세요.

## 개발 서버 실행

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
