# OQVETA

OQVETAは、学びやデザイン、テクノロジー、日々の発見を静かに記録する匿名運営の個人デジタルジャーナルです。

公開サイト: https://oqveta.github.io

## 技術構成

- Astro 7（静的サイト生成）
- Vue 3（検索・ナビゲーションなどの必要なインタラクション）
- Tailwind CSS 4
- TypeScript
- Markdownによる記事管理
- Lucide icons（Iconify）
- IBM Plex Sans / IBM Plex Mono

## ローカルでの起動

Node.js 24 と pnpm 10.33 以降を使用します。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

http://localhost:4321 で確認できます。

## 主なコマンド

| コマンド | 内容 |
| --- | --- |
| `pnpm dev` | 開発サーバーを起動 |
| `pnpm build` | 型チェックと本番ビルド |
| `pnpm preview` | 本番ビルドをローカルで確認 |
| `pnpm check` | Astro・Vue・TypeScriptの型チェック |
| `pnpm test:e2e` | ブラウザテスト |
| `pnpm format` | コードを整形 |

## 記事の追加

`src/content/posts/ja/` にMarkdownファイルを追加します。

```yaml
---
title: "記事タイトル"
description: "記事の概要"
date: 2026-11-13
lang: ja
category: notes
tags: ["日記", "テクノロジー"]
featured: true
draft: false
---
```

記事はトップページのピックアップ・最新記事欄に自動反映されます。本文の最初のMarkdown画像は記事カードのカバー画像として利用されます。

## サイト設定

- サイト名・匿名プロフィール・ナビゲーション: `src/site.config.json`
- 日本語UI: `src/i18n/ja.json`
- 記事: `src/content/posts/ja/`
- デザイン・テーマ: `src/styles/global.css`
- トップページ: `src/pages/index.astro`

## 公開

mainブランチへのpushでGitHub Actionsがビルドし、GitHub Pagesへデプロイします。初回のみGitHubリポジトリの Settings → Pages で、Build and deployment の Source を GitHub Actions に設定してください。
