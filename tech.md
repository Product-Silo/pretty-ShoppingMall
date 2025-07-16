# 브랜치 전략 >

main < 프로덕트 레벨의 브랜치

develop < 연습용 레벨의 브랜치

## 워크 플로우

1.  develop에서 작업하고 이후 develop에 푸시.
2.  그 다음 main에 PR를 날리고 머지하기.

그 상태에서 vs code로 간 이후

```bash
git checkout main
```

을 해서 main으로 이동 이후 3.
pull해서 최신화하기.

```bash
git pull origin main
```

### branch

branch 관련 명령어

```bash
git branch
// 현재 브랜치 상황

git branch text
// 새로운 브랜치 만들기
```
