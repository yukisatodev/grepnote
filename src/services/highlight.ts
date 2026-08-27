import { tokenize } from './tokenizer'

export interface HighlightRange {
  start: number
  end: number // exclusive
}

export interface HighlightedExcerpt {
  text: string
  ranges: HighlightRange[]
}

const EXCERPT_CONTEXT_LENGTH = 40

function findAllOccurrences(haystack: string, needle: string): number[] {
  if (needle.length === 0) return []

  const positions: number[] = []
  let searchFrom = 0
  while (true) {
    const foundAt = haystack.indexOf(needle, searchFrom)
    if (foundAt === -1) break
    positions.push(foundAt)
    // 1文字だけ進めることで "aaa" に対する "aa" のような重複マッチも拾う
    searchFrom = foundAt + 1
  }
  return positions
}

function findMatchRanges(normalizedText: string, queryTokens: string[]): HighlightRange[] {
  return queryTokens.flatMap((token) =>
    findAllOccurrences(normalizedText, token).map((start) => ({
      start,
      end: start + token.length,
    })),
  )
}

function mergeOverlappingRanges(ranges: HighlightRange[]): HighlightRange[] {
  if (ranges.length === 0) return []

  const sorted = [...ranges].sort((a, b) => a.start - b.start)
  const merged: HighlightRange[] = [{ ...sorted[0] }]

  for (const range of sorted.slice(1)) {
    const last = merged[merged.length - 1]
    if (range.start <= last.end) {
      last.end = Math.max(last.end, range.end)
    } else {
      merged.push({ ...range })
    }
  }

  return merged
}

function truncateFromStart(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

/**
 * クエリと一致した箇所を中心に、本文から抜粋を作る。
 * NFKC正規化・小文字化は文字数を変えない変換である前提で、
 * 正規化後の文字位置をそのまま元の文字列の位置として扱っている。
 */
export function buildHighlightedExcerpt(originalText: string, query: string): HighlightedExcerpt {
  const normalizedText = originalText.normalize('NFKC').toLowerCase()
  const queryTokens = tokenize(query)
  const matchRanges = mergeOverlappingRanges(findMatchRanges(normalizedText, queryTokens))

  if (matchRanges.length === 0) {
    return { text: truncateFromStart(originalText, EXCERPT_CONTEXT_LENGTH * 2), ranges: [] }
  }

  const firstMatch = matchRanges[0]
  const excerptStart = Math.max(0, firstMatch.start - EXCERPT_CONTEXT_LENGTH)
  const excerptEnd = Math.min(originalText.length, firstMatch.end + EXCERPT_CONTEXT_LENGTH)
  const hasPrefixEllipsis = excerptStart > 0
  const hasSuffixEllipsis = excerptEnd < originalText.length
  const prefix = hasPrefixEllipsis ? '…' : ''
  const suffix = hasSuffixEllipsis ? '…' : ''
  const excerptBody = originalText.slice(excerptStart, excerptEnd)

  const rangesWithinExcerpt = matchRanges
    .map((range) => ({
      start: range.start - excerptStart + prefix.length,
      end: range.end - excerptStart + prefix.length,
    }))
    .filter((range) => range.end > prefix.length && range.start < prefix.length + excerptBody.length)
    .map((range) => ({
      start: Math.max(prefix.length, range.start),
      end: Math.min(prefix.length + excerptBody.length, range.end),
    }))

  return {
    text: prefix + excerptBody + suffix,
    ranges: rangesWithinExcerpt,
  }
}
