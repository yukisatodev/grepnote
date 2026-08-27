import type { Memo } from '../types'
import { seedMemos } from './seedData'

const STORAGE_KEY = 'grepnote:memos'

function readFromStorage(): Memo[] | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  return JSON.parse(raw) as Memo[]
}

function writeToStorage(memos: Memo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memos))
}

export const memoRepository = {
  /**
   * 保存済みデータがなければサンプルデータを初期投入して返す。
   * デモを開いた瞬間に「動いている状態」が見えるようにするための挙動。
   */
  loadAll(): Memo[] {
    const stored = readFromStorage()
    if (stored) return stored

    writeToStorage(seedMemos)
    return seedMemos
  },

  saveAll(memos: Memo[]): void {
    writeToStorage(memos)
  },
}
