# 🌙 음력 생일 양력 변환기

음력 생일을 양력으로 변환해주는 웹 애플리케이션입니다. 2025년부터 2050년까지의 양력 날짜를 확인하고, Google Calendar에 가져올 수 있는 CSV 파일로 다운로드할 수 있습니다.

## ✨ 주요 기능

- 🎂 **기념일 관리**: 기념일 제목과 음력 날짜 입력
- 📅 **정확한 변환**: 한국천문연구원 데이터 기반 음력-양력 변환
- 🔮 **미래 날짜**: 현재일 이후 2050년까지의 양력 날짜 표시
- 📥 **CSV 다운로드**: Google Calendar 가져오기 형식으로 내보내기
- 📋 **클립보드 복사**: 변환 결과를 클립보드에 바로 복사
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용 경험

## 🚀 빠른 시작

### 온라인 사용
배포된 사이트에서 바로 사용하실 수 있습니다

### 로컬 개발

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### CloudFlare Pages 배포 문제 해결

**문제**: https://709957f7.lunar-1tz.pages.dev/ 에서 404 오류 발생

**원인**: 현재 프로젝트가 fullstack 구조로 되어 있어서 정적 배포가 제대로 되지 않음

**해결 방법**:

**CloudFlare Pages 빌드 설정**:
   ```
   Build command: node build-client.js
   Build output directory: dist
   Root directory: (비워두기)
   Environment variables: NODE_VERSION=20
   ```

2. **또는 클라이언트만 따로 빌드**:
   - `client` 폴더만 별도 리포지토리로 분리
   - Vite 프로젝트로 독립 배포

3. **즉시 해결 방법**:
   - CloudFlare Pages에서 "Retry deployment" 클릭
   - 빌드 로그에서 오류 확인
   - `dist/` 폴더에 `index.html`이 생성되는지 확인

개발 서버가 `http://localhost:5000`에서 실행됩니다.

## 📖 사용 방법

1. **기념일 제목 입력**: "할머니 생신", "아버지 생신" 등
2. **음력 날짜 선택**: 음력 월과 일을 드롭다운에서 선택
3. **변환하기**: 버튼을 클릭하여 양력 날짜 변환
4. **결과 확인**: 연도별 양력 날짜, 요일, D-Day 정보 확인
5. **내보내기**: CSV 다운로드 또는 클립보드 복사

## 🛠️ 기술 스택

### Frontend
- **React 18**: 모던 React 훅과 함수형 컴포넌트
- **TypeScript**: 타입 안전성과 개발자 경험 향상
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **shadcn/ui**: 접근성과 디자인이 우수한 컴포넌트 라이브러리
- **React Hook Form**: 성능 최적화된 폼 관리
- **TanStack Query**: 서버 상태 관리
- **Wouter**: 경량 라우팅 라이브러리

### Backend
- **Node.js**: JavaScript 런타임
- **Express**: 웹 애플리케이션 프레임워크
- **TypeScript**: 백엔드 타입 안전성

### 개발 도구
- **Vite**: 빠른 번들링과 개발 서버
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅

## 📁 프로젝트 구조

```
├── client/                 # 프론트엔드 소스
│   ├── src/
│   │   ├── components/     # React 컴포넌트
│   │   ├── lib/           # 유틸리티 및 라이브러리
│   │   ├── pages/         # 페이지 컴포넌트
│   │   └── hooks/         # 커스텀 훅
│   └── index.html         # HTML 템플릿
├── server/                # 백엔드 소스
│   ├── index.ts          # Express 서버 진입점
│   └── routes.ts         # API 라우트
├── shared/               # 공유 타입 정의
└── attached_assets/      # 음력-양력 변환 데이터
```

## 🎨 디자인 특징

- **한국어 최적화**: Noto Sans KR 폰트와 한국어 UI
- **접근성**: WCAG 가이드라인 준수
- **반응형**: 모바일부터 데스크탑까지 최적화
- **다크모드 준비**: CSS 변수 기반 테마 시스템

## 📊 CSV 출력 형식

Google Calendar에서 바로 가져올 수 있는 형식으로 출력됩니다:

```csv
Subject,Start Date,All Day Event
할머니 생신,2025-02-17,TRUE
할머니 생신,2026-02-06,TRUE
할머니 생신,2027-01-26,TRUE
```

## 🔧 환경 설정

프로젝트는 별도의 환경 변수 없이 실행됩니다. 모든 설정이 코드에 포함되어 있습니다.

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

버그 리포트나 기능 제안은 Issues를 통해 알려주시기 바랍니다.

## 📞 문의

프로젝트에 대한 자세한 정보는 [블로그](https://blog.naver.com/binsoore/221560112434)를 참조하세요.

---

© 2024 음력 생일 양력 변환기