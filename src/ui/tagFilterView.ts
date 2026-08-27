import type { Memo } from '../types'
import { escapeHtml } from './htmlEscape'

export function collectTags(memos: Memo[]): string[] {
  const tagSet = new Set<string>()
  for (const memo of memos) {
    for (const tag of memo.tags) tagSet.add(tag)
  }
  return [...tagSet].sort()
}

export function renderTagFilter(tags: string[], selectedTag: string | null): string {
  return tags
    .map((tag) => {
      const isSelected = tag === selectedTag
      return `<button type="button" class="tag-filter-chip${isSelected ? ' is-selected' : ''}" data-tag="${escapeHtml(tag)}" aria-pressed="${isSelected}">#${escapeHtml(tag)}</button>`
    })
    .join('')
}
