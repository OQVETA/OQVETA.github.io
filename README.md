# OQVETA

OQVETAは、サイトのリリース情報や機能追加、改善・修正の記録をまとめる匿名運営のリリースブログです。

公開サイト: https://oqveta.github.io

## 技術構成

- Astro 7
- Vue 3（必要なインタラクション部分のみ）
- Tailwind CSS 4
- TypeScript
- Markdownによるリリース記事管理
- 日本語フォント: Noto Sans JP

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

## リリース記事の追加

`src/content/posts/ja/` にMarkdownファイルを追加します。

```yaml
---
title: "アップデートタイトル"
description: "今回の更新内容"
date: 2026-11-13
lang: ja
category: notes
tags: ["リリース", "アップデート"]
featured: true
draft: false
---
```

## サイト設定

- サイト名・匿名プロフィール・ナビゲーション: `src/site.config.json`
- 日本語UI: `src/i18n/ja.json`
- リリース記事: `src/content/posts/ja/`
- タイポグラフィ・スタイル: `src/styles/global.css`

## 公開

mainブランチへのpushでGitHub Actionsがビルドし、GitHub Pagesへデプロイします。初回のみGitHubリポジトリの Settings → Pages で、Build and deployment の Source を GitHub Actions に設定してください。

元テンプレートの構成をベースに、デザインの骨格を維持しながら日本語の読みやすさを調整しています。
