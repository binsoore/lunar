# CloudFlare Pages 배포 가이드

## 문제 해결

사이트가 404 오류를 보이는 경우:

### 1. CloudFlare Pages 빌드 설정 확인

**올바른 CloudFlare Pages 설정**:
```
Build command: node build-client.js
Build output directory: dist
Root directory: (비워두기)
Node.js version: 20
```

**중요**: `npm run build`는 서버용 빌드이므로 `node build-client.js`를 사용해야 합니다.

**빌드 환경 변수**:
- `NODE_VERSION`: `20`
- `NODE_ENV`: `production`

### 2. 환경 변수 설정

CloudFlare Pages 대시보드에서:
- `NODE_VERSION`: `20`
- `NODE_ENV`: `production`

### 3. 수동 빌드 및 배포

로컬에서 빌드 테스트:
```bash
node build-static.js
```

### 4. 파일 구조 확인

빌드 후 다음 구조가 생성되어야 함:
```
dist/
├── index.html (클라이언트 빌드 결과)
├── _redirects (SPA 라우팅용)
└── [기타 정적 파일들]
```

**현재 상태**: `dist/` 폴더에 서버 빌드 결과물만 있음
**필요한 작업**: CloudFlare Pages에서 클라이언트 빌드가 제대로 실행되도록 설정 수정

### 5. 일반적인 문제들

- **빌드 실패**: package.json의 dependencies 확인
- **라우팅 문제**: _redirects 파일이 dist/에 있는지 확인
- **에셋 로딩 실패**: 상대 경로 설정 확인

### 6. CloudFlare Pages 재배포

1. CloudFlare Pages 대시보드 접속
2. 프로젝트 선택
3. "Deployments" 탭
4. "Retry deployment" 또는 새 커밋 푸시

### 7. 디버깅

빌드 로그 확인:
- CloudFlare Pages 대시보드의 "View build log"
- 오류 메시지 분석
- 패키지 버전 호환성 확인