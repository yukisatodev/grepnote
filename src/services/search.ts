import type { Memo } from '../types'
import type { InvertedIndex } from './indexer'
import { tokenize } from './tokenizer'

export interface SearchResult {
  memo: Memo
  score: number
}

/**
 * クエリのユニークトークンのうち、この割合以上が一致しないメモは結果から除外する。
 * bi-gram方式は短いトークン(2文字)単位で一致を見るため、"rebase"の"as"が
 * "async"に、"se"が"Promise"に、といった意味的に無関係な部分一致でノイズが
 * 混ざることが実装中の動作確認で分かった。TF-IDFのスコアだけでは
 * ノイズが下位に沈むだけで結果から消えないため、一致率で足切りする。
 */
const MIN_TOKEN_COVERAGE = 0.5

function calculateIdf(documentFrequency: number, totalMemoCount: number): number {
  // +1は、あるトークンが全メモに共通して出現しdocumentFrequencyが
  // totalMemoCountと一致した場合にidfがちょうど0になり、そのトークンの
  // 一致がスコアに全く反映されなくなる(=マッチしたのに無視される)のを防ぐための平滑化
  return Math.log(totalMemoCount / documentFrequency + 1)
}

function accumulateScores(
  queryTokens: string[],
  index: InvertedIndex,
  totalMemoCount: number,
): Map<string, number> {
  const scoreByMemoId = new Map<string, number>()

  for (const token of queryTokens) {
    const postings = index.get(token)
    if (!postings) continue

    const idf = calculateIdf(postings.size, totalMemoCount)
    for (const [memoId, termFrequency] of postings) {
      const currentScore = scoreByMemoId.get(memoId) ?? 0
      scoreByMemoId.set(memoId, currentScore + termFrequency * idf)
    }
  }

  return scoreByMemoId
}

function calculateTokenCoverage(
  uniqueQueryTokens: Set<string>,
  index: InvertedIndex,
  memoId: string,
): number {
  if (uniqueQueryTokens.size === 0) return 0

  let matchedTokenCount = 0
  for (const token of uniqueQueryTokens) {
    if (index.get(token)?.has(memoId)) matchedTokenCount += 1
  }

  return matchedTokenCount / uniqueQueryTokens.size
}

export function search(query: string, memos: Memo[], index: InvertedIndex): SearchResult[] {
  const queryTokens = tokenize(query)
  if (queryTokens.length === 0) return []

  const uniqueQueryTokens = new Set(queryTokens)
  const scoreByMemoId = accumulateScores(queryTokens, index, memos.length)
  const memoById = new Map(memos.map((memo) => [memo.id, memo]))

  const results: SearchResult[] = []
  for (const [memoId, score] of scoreByMemoId) {
    const memo = memoById.get(memoId)
    if (!memo) continue

    const coverage = calculateTokenCoverage(uniqueQueryTokens, index, memoId)
    if (coverage < MIN_TOKEN_COVERAGE) continue

    results.push({ memo, score })
  }

  return results.sort((a, b) => b.score - a.score)
}
