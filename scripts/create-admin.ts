/**
 * 초기 관리자 계정 생성 스크립트
 *
 * 사용법:
 *   npm run admin:create
 *
 * 환경변수 필요:
 *   - ADMIN_PROVISION_SECRET: Provision API 인증 시크릿
 *   - NEXT_PUBLIC_SITE_URL: API 엔드포인트 URL (선택, 기본값: http://localhost:3000)
 */

import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

interface ProvisionResponse {
  ok: boolean;
  authUserId: string;
  isNewUser: boolean;
  error?: string;
}

async function createFirstAdmin() {
  console.log('🔧 초기 관리자 계정 생성 스크립트\n');

  // 환경변수 검증
  const secret = process.env.ADMIN_PROVISION_SECRET;
  if (!secret) {
    console.error('❌ 오류: ADMIN_PROVISION_SECRET 환경변수가 설정되지 않았습니다.');
    console.error('   .env 파일에 ADMIN_PROVISION_SECRET을 추가해주세요.\n');
    process.exit(1);
  }

  const apiUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // 사용자 입력 받기
  const rl = createInterface({ input, output });

  try {
    const email = await rl.question('관리자 이메일: ');
    if (!email || !email.includes('@')) {
      console.error('❌ 유효한 이메일을 입력해주세요.');
      process.exit(1);
    }
    const password = await rl.question('비밀번호: ');

    if (!password) {
      console.error('❌ 비밀번호를 입력해주세요.');
      process.exit(1);
    }

    const fullName = await rl.question('관리자 이름 (선택): ');
    console.log('\n📡 관리자 계정 생성 중...');

    // API 호출
    const response = await fetch(`${apiUrl}/api/admin/provision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Provision-Secret': secret,
      },
      body: JSON.stringify({
        email,
        password: password || undefined,
        fullName: fullName || undefined,
      }),
    });

    const result: ProvisionResponse = await response.json();

    if (!response.ok || result.error) {
      console.error(`❌ 실패: ${result.error || '알 수 없는 오류'}`);
      console.error(`   상태 코드: ${response.status}\n`);
      process.exit(1);
    }

    // 성공
    console.log('\n✅ 관리자 계정 생성 완료!\n');
    console.log(`   이메일: ${email}`);
    console.log(`   이름: ${fullName || '(없음)'}`);
    console.log(`   사용자 ID: ${result.authUserId}`);
    console.log(`   상태: ${result.isNewUser ? '새로 생성됨' : '기존 사용자 재사용'}\n`);

    if (!password) {
      console.log('⚠️  비밀번호가 자동 생성되었습니다.');
      console.log('   Supabase Auth 대시보드에서 비밀번호 재설정 이메일을 발송하거나,');
      console.log('   관리자 로그인 페이지에서 "비밀번호 찾기"를 이용하세요.\n');
    }
  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createFirstAdmin();
