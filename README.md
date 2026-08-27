# grepnote

散らばった技術メモを、自作の検索エンジンで見つけるためのWebアプリ。

技術記事の要点やコードスニペットをメモしても、後から探せなければ意味がない。
既存の検索ライブラリに頼らず、転置インデックス・日英混在トークナイズ・TF-IDFスコアリングを
自分で実装することで、「検索とは何をしているのか」を理解し、その過程の意思決定を公開したポートフォリオ作品。

**Demo**: (デプロイ後にURLを追記)

## このリポジトリの読み方

このプロジェクトは「動くもの」であると同時に「なぜそう作ったかの記録」でもある。

1. [docs/00-concept.md](./docs/00-concept.md) — 何を、誰のために、なぜ作ったか
2. [docs/01-requirements.md](./docs/01-requirements.md) — 機能要件・非機能要件・スコープ
3. [docs/02-design.md](./docs/02-design.md) — 画面設計・データ設計・処理フロー
4. [docs/03-decisions.md](./docs/03-decisions.md) — 技術選定のログ(比較・却下理由・採用理由)
5. [docs/04-tradeoffs.md](./docs/04-tradeoffs.md) — 実装してみて分かった工夫と限界

## 技術スタック

- Vanilla TypeScript + Vite(理由: [ADR-001](./docs/03-decisions.md#adr-001-ui実装にフレームワークを使わない))
- 検索: 自作の転置インデックス + TF-IDFスコアリング
- 永続化: localStorage
- デプロイ: GitHub Pages(GitHub Actions経由)

## セットアップ

```bash
npm install
npm run dev
```

## テスト

`services/`層(トークナイズ・インデックス構築・スコアリング)をVitestで単体テストしている。範囲を絞った理由は[ADR-006](./docs/03-decisions.md#adr-006-テストの範囲)を参照。

```bash
npm run test
```

## ディレクトリ構成

```
src/
├── main.ts        # エントリーポイント
├── ui/             # DOM描画・イベントハンドリング(ロジックを持たない)
├── services/       # トークナイズ・インデックス構築・スコアリング
├── api/            # 疑似APIクライアント層
└── data/           # 永続化(localStorage)・サンプルデータ
```

なぜこの層分離にしたかは [03-decisions.md](./docs/03-decisions.md) の「アーキテクチャ全体の設計判断」を参照。
