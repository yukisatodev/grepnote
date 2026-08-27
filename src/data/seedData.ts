import type { Memo } from '../types'

/**
 * 初回起動時に投入するサンプルメモ。
 * 日本語・英語が混在する、実際の技術メモに近い文面にしている。
 */
export const seedMemos: Memo[] = [
  {
    id: 'seed-1',
    title: 'TypeScriptのジェネリクスで型を使い回す',
    body: '関数やクラスを特定の型に縛らずに書きたいときはgenericsを使う。<T>のように書いて、呼び出し側が渡した型がそのまま反映される。Array<T>やPromise<T>も内部的には同じ仕組み。',
    tags: ['typescript', 'generics'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 30,
  },
  {
    id: 'seed-2',
    title: 'git rebaseとmergeの使い分け',
    body: 'mergeは履歴をそのまま残すのでチーム開発の記録として安心。rebaseは履歴を一直線にできるが、共有済みのブランチでやると他の人の履歴を壊す。個人のfeatureブランチを整理するときだけrebaseを使うようにしている。',
    tags: ['git'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 25,
  },
  {
    id: 'seed-3',
    title: 'CSS FlexboxとGridの使い分け',
    body: '1方向に並べるだけならflexboxで十分。行と列を同時にコントロールしたい、いわゆる二次元レイアウトのときはgridを使う。カード一覧のようなレイアウトはgrid-template-columnsのauto-fillが便利。',
    tags: ['css'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 20,
  },
  {
    id: 'seed-4',
    title: 'async/awaitとPromiseの関係',
    body: 'async/awaitはPromiseを読みやすく書くための構文糖衣にすぎない。内部では必ずPromiseが動いている。エラーハンドリングはtry/catchで包めばcatchできる。Promise.allと組み合わせて並列実行するパターンをよく使う。',
    tags: ['javascript', 'async'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 18,
  },
  {
    id: 'seed-5',
    title: 'Reactでkeyを適切に設定する理由',
    body: 'リストをレンダリングするときkeyを配列のindexにすると、要素の並び替えや削除があったときに再利用のロジックが壊れて意図しない再描画が起きる。keyには変化しない一意なidを使うべき。',
    tags: ['react'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 15,
  },
  {
    id: 'seed-6',
    title: 'Dockerのマルチステージビルドでイメージを軽くする',
    body: 'ビルド専用のstageとランタイム専用のstageを分けて、最終的なイメージにはビルドツールを含めない。COPY --from=builderで成果物だけを持ってくる。node_modulesの重複を避けられて本番イメージが小さくなる。',
    tags: ['docker', 'infra'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12,
  },
  {
    id: 'seed-7',
    title: 'SQLでインデックスを張る基準',
    body: 'WHERE句やJOINの条件によく使うカラムにインデックスを張ると検索が速くなる。ただし書き込みのたびにインデックスの更新コストがかかるので、更新頻度が高いテーブルに闇雲に張ると逆に遅くなることがある。',
    tags: ['sql', 'database'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 9,
  },
  {
    id: 'seed-8',
    title: 'HTTPステータスコードの覚え方',
    body: '2xxは成功、3xxはリダイレクト、4xxはクライアント側のミス、5xxはサーバー側のミス。403は権限不足、401は未認証。この違いをAPI設計で意識するとエラーハンドリングが書きやすくなる。',
    tags: ['http', 'api'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 6,
  },
  {
    id: 'seed-9',
    title: 'Linuxのパーミッションとchmodの数字',
    body: 'rwxを2進数として読むとchmodの数字になる。読み書き実行が全部有効なら7、読み書きだけなら6。chmod 755は所有者がrwx、それ以外がr-xという意味。ディレクトリのxは中に入る権限を意味する。',
    tags: ['linux'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
  },
  {
    id: 'seed-10',
    title: '正規表現の先読み(lookahead)の使いどころ',
    body: '(?=...)は先読み、(?<=...)は後読み。「数字の直前にカンマがある場合だけマッチさせたい」のように、マッチ自体には含めたくないが条件として使いたいときに便利。3桁区切りのカンマ挿入でよく使うパターン。',
    tags: ['regex'],
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
  },
]
