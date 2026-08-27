import type { Memo, MemoInput } from '../types'
import { memoRepository } from '../data/memoRepository'
import { addToIndex, buildIndex, removeFromIndex, type InvertedIndex } from '../services/indexer'
import { search as rankMemos, type SearchResult } from '../services/search'

let memos: Memo[] = memoRepository.loadAll()
let index: InvertedIndex = buildIndex(memos)

function sortByNewest(list: Memo[]): Memo[] {
  return [...list].sort((a, b) => b.createdAt - a.createdAt)
}

export const memoApi = {
  list(): Memo[] {
    return sortByNewest(memos)
  },

  create(input: MemoInput): Memo {
    const memo: Memo = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...input,
    }

    memos = [...memos, memo]
    memoRepository.saveAll(memos)
    addToIndex(index, memo)

    return memo
  },

  remove(id: string): void {
    memos = memos.filter((memo) => memo.id !== id)
    memoRepository.saveAll(memos)
    removeFromIndex(index, id)
  },

  search(query: string): SearchResult[] {
    return rankMemos(query, memos, index)
  },
}
