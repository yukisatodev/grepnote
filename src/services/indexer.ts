import type { Memo } from '../types'
import { tokenize } from './tokenizer'

/** トークン -> (メモID -> そのメモ内での出現回数) */
export type InvertedIndex = Map<string, Map<string, number>>

function collectSearchableText(memo: Memo): string {
  return [memo.title, memo.body, ...memo.tags].join(' ')
}

function countOccurrences(tokens: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }
  return counts
}

export function createEmptyIndex(): InvertedIndex {
  return new Map()
}

export function addToIndex(index: InvertedIndex, memo: Memo): void {
  const tokens = tokenize(collectSearchableText(memo))
  const occurrences = countOccurrences(tokens)

  for (const [token, count] of occurrences) {
    if (!index.has(token)) {
      index.set(token, new Map())
    }
    index.get(token)!.set(memo.id, count)
  }
}

/**
 * 全トークンを走査して該当メモIDを消す(語彙数分の計算量)。
 * メモ数百件規模を想定する今回のスコープでは許容範囲と判断しているが、
 * 語彙が大きくなる場合はメモID→トークン一覧の逆引きを別途持つ設計に変える必要がある。
 */
export function removeFromIndex(index: InvertedIndex, memoId: string): void {
  for (const [token, memoCounts] of index) {
    memoCounts.delete(memoId)
    if (memoCounts.size === 0) {
      index.delete(token)
    }
  }
}

export function buildIndex(memos: Memo[]): InvertedIndex {
  const index = createEmptyIndex()
  for (const memo of memos) {
    addToIndex(index, memo)
  }
  return index
}
