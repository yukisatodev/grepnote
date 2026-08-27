import type { HighlightedExcerpt } from '../services/highlight'
import { escapeHtml } from './htmlEscape'

/**
 * range境界で文字列を分割してから個別にエスケープする。
 * 先に全体をescapeHtmlしてから<mark>を差し込むと、"&lt;"のような
 * 複数文字への置換でハイライト位置がズレるため、この順序にしている。
 */
export function renderHighlightedText(excerpt: HighlightedExcerpt): string {
  const { text, ranges } = excerpt
  if (ranges.length === 0) return escapeHtml(text)

  let html = ''
  let cursor = 0
  for (const range of ranges) {
    html += escapeHtml(text.slice(cursor, range.start))
    html += `<mark>${escapeHtml(text.slice(range.start, range.end))}</mark>`
    cursor = range.end
  }
  html += escapeHtml(text.slice(cursor))

  return html
}
