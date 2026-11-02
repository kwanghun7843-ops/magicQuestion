# 마법학교 질문탐험대: 사라진 빛의 별

유아부터 초등학교 3학년 수준을 위한 **질문 → 탐구 → 성찰**형 방 탈출 웹게임입니다.

- 외부 API와 회원가입 없이 실행
- 모바일·태블릿·PC 반응형
- 진행 상황을 브라우저 `localStorage`에 자동 저장
- 질문 선택에 따라 각 방에서 얻는 단서와 최종 답이 달라짐
- 미션 완료 시 다음 방 포탈 생성
- 최종 답·근거·성찰을 함께 판정하여 굿엔딩 또는 재도전 엔딩 표시

## GitHub Pages 배포

1. 이 압축파일을 풉니다.
2. GitHub에서 새 저장소를 만듭니다.
3. 저장소의 **Add file → Upload files**를 누릅니다.
4. 압축을 푼 폴더 안의 모든 파일과 폴더를 업로드합니다.  
   `index.html`이 저장소의 가장 바깥에 있어야 합니다.
5. **Settings → Pages**로 이동합니다.
6. Source를 **Deploy from a branch**, Branch를 **main / (root)**로 선택하고 저장합니다.
7. 잠시 기다린 뒤 표시되는 GitHub Pages 주소로 접속합니다.

## 파일 구성

```text
index.html
css/style.css
js/app.js
assets/images/
assets/sprites/
```

## 게임 흐름

1. 잠든 초상화의 회랑: 최종 질문과 첫 생각 선택
2. 약초 온실: 관찰·비교·분류
3. 빗자루 우편실: 순서·경로 찾기
4. 음악 계단: 반복 규칙 예측
5. 중앙탑: 답·근거·성찰 연결

## 모션 시트 배열

- `hero-movement-6x2.png`: 6열 × 2행
- `hero-actions-4x2.png`: 4열 × 2행
- `lumi-actions-4x2.png`: 4열 × 2행
- `portal-create-6x1.png`: 6열 × 1행
- `magic-ui-effects-4x3.png`: 4열 × 3행

게임 데이터와 문구는 `js/app.js`의 `QUESTIONS` 부분에서 수정할 수 있습니다.

## 초기화

게임 화면 오른쪽 위의 집 모양 버튼을 눌러 첫 화면으로 돌아간 뒤 **새로 시작하기**를 선택합니다.

