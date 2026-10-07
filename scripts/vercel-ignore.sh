#!/bin/bash
# Vercel "Ignored Build Step": exit 0 = build ATLANIR, exit 1 = build ÇALIŞIR.
# Kural: yalnız main dalında ve yalnız siteyi etkileyen dosyalar değiştiyse build.
if [ "$VERCEL_GIT_COMMIT_REF" != "main" ]; then
  echo "Önizleme build'i atlandı (dal: $VERCEL_GIT_COMMIT_REF)"; exit 0
fi
PREV="${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}"
git cat-file -e "$PREV" 2>/dev/null || PREV="HEAD^"
if git diff --quiet "$PREV" HEAD -- . ':(exclude)docs' ':(exclude)*.md' ':(exclude)legacy' ':(exclude)tests' ':(exclude).github' ':(exclude)playwright.config.ts'; then
  echo "Yalnız belge/test değişikliği: build atlandı"; exit 0
fi
echo "Site dosyaları değişti: build çalışacak"; exit 1
