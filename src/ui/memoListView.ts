import type { Memo } from '../types'
import type { SearchResult } from '../services/search'
import { buildHighlightedExcerpt } from '../services/highlight'
import { escapeHtml } from './htmlEscape'
import { renderHighlightedText } from './renderHighlight'

const PLAIN_EXCERPT_LENGTH = 80

function renderTags(tags: string[]): string {
  return tags.map((tag) => `<span class="tag">#${escapeHtml(tag)}</span>`).join('')
}

function truncatePlain(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

function renderMemoItem(params: {
  memo: Memo
  titleHtml: string
  bodyHtml: string
  scoreLabel?: string
}): string {
  const { memo, titleHtml, bodyHtml, scoreLabel } = params

  return `
    <li class="memo-item">
      <div class="memo-item-header">
        <h2 class="memo-title">${titleHtml}</h2>
        ${scoreLabel ? `<span class="memo-score">${escapeHtml(scoreLabel)}</span>` : ''}
      </div>
      <p class="memo-body">${bodyHtml}</p>
      <div class="memo-footer">
        <div class="memo-tags">${renderTags(memo.tags)}</div>
        <button class="delete-memo-button" data-memo-id="${escapeHtml(memo.id)}" type="button">削除</button>
      </div>
    </li>
  `
}

/** 検索していないときの、新着順の一覧表示 */
export function renderBrowseList(memos: Memo[]): string {
  if (memos.length === 0) {
    return '<li class="memo-empty">まだメモがありません。「+ メモを追加」から登録してみてください。</li>'
  }

  return memos
    .map((memo) =>
      renderMemoItem({
        memo,
        titleHtml: escapeHtml(memo.title),
        bodyHtml: escapeHtml(truncatePlain(memo.body, PLAIN_EXCERPT_LENGTH)),
      }),
    )
    .join('')
}

/** 検索したときの、スコア順+ハイライト付きの一覧表示 */
export function renderSearchResultList(results: SearchResult[], query: string): string {
  if (results.length === 0) {
    return '<li class="memo-empty">一致するメモが見つかりませんでした。</li>'
  }

  return results
    .map(({ memo, score }) =>
      renderMemoItem({
        memo,
        titleHtml: renderHighlightedText(buildHighlightedExcerpt(memo.title, query)),
        bodyHtml: renderHighlightedText(buildHighlightedExcerpt(memo.body, query)),
        scoreLabel: `score ${score.toFixed(2)}`,
      }),
    )
    .join('')
}
