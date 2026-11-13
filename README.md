# OQVETA

匿名で運営する個人ブログです。日々の記録、読んだ本、学んだこと、ふと考えたことなどを自分のペースで書いています。

公開サイト: https://oqveta.github.io

## 技術構成

- Astro 7
- Vue 3（必要なインタラクション部分のみ）
- Tailwind CSS 4
- TypeScript
- Markdownによる記事管理

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
| `pnpm test` | ビルドとブラウザテスト |
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
tags: ["日々の記録"]
featured: false
draft: false
---
```

カテゴリーは `guides`、`notes`、`stories` から選択できます。

## サイト設定

- サイト名・匿名プロフィール・ナビゲーション: `src/site.config.json`
- 日本語UI: `src/i18n/ja.json`
- 記事: `src/content/posts/ja/`
- テーマのスタイル: `src/styles/global.css`

## 公開

mainブランチへのpushでGitHub Actionsがビルドし、GitHub Pagesへデプロイします。初回のみGitHubリポジトリの Settings → Pages で、Build and deployment の Source を GitHub Actions に設定してください。

デザインとスタイルは元テンプレートの状態を維持し、通常の更新では記事や表示文言のみを変更します。
