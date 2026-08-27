import { describe, expect, it } from 'vitest'
import type { Memo } from '../types'
import { addToIndex, buildIndex, removeFromIndex } from './indexer'

function makeMemo(overrides: Partial<Memo>): Memo {
  return {
    id: 'memo-1',
    title: '',
    body: '',
    tags: [],
    createdAt: 0,
    ...overrides,
  }
}

describe('buildIndex', () => {
  it('タイトル・本文・タグをまとめてインデックス化する', () => {
    const memo = makeMemo({ id: 'm1', title: 'git', body: 'rebase', tags: ['branch'] })
    const index = buildIndex([memo])

    expect(index.get('gi')?.get('m1')).toBe(1)
    expect(index.get('re')?.get('m1')).toBe(1)
    expect(index.get('br')?.get('m1')).toBe(1)
  })

  it('複数メモに共通するトークンは、両方のメモIDに紐づく', () => {
    const memoA = makeMemo({ id: 'a', title: 'git rebase' })
    const memoB = makeMemo({ id: 'b', title: 'git merge' })
    const index = buildIndex([memoA, memoB])

    const gitToken = index.get('gi')
    expect(gitToken?.get('a')).toBe(1)
    expect(gitToken?.get('b')).toBe(1)
  })

  it('同じトークンが1メモ内で複数回出現したら出現回数を数える', () => {
    const memo = makeMemo({ title: 'aa aa' })
    const index = buildIndex([memo])

    // "aa aa" -> 単語 "aa", "aa" -> それぞれ1文字クラス超なのでbi-gram "aa" が2回出現
    expect(index.get('aa')?.get('memo-1')).toBe(2)
  })
})

describe('addToIndex', () => {
  it('既存のインデックスに新しいメモを追加できる', () => {
    const index = buildIndex([makeMemo({ id: 'a', title: 'git' })])
    addToIndex(index, makeMemo({ id: 'b', title: 'git' }))

    expect(index.get('gi')?.get('a')).toBe(1)
    expect(index.get('gi')?.get('b')).toBe(1)
  })
})

describe('removeFromIndex', () => {
  it('指定したメモIDをすべてのトークンから取り除く', () => {
    const index = buildIndex([
      makeMemo({ id: 'a', title: 'git' }),
      makeMemo({ id: 'b', title: 'git' }),
    ])

    removeFromIndex(index, 'a')

    expect(index.get('gi')?.has('a')).toBe(false)
    expect(index.get('gi')?.has('b')).toBe(true)
  })

  it('削除の結果、該当メモを含まなくなったトークンはインデックスから消える', () => {
    const index = buildIndex([makeMemo({ id: 'a', title: 'git' })])

    removeFromIndex(index, 'a')

    expect(index.has('gi')).toBe(false)
  })
})
