import { describe, expect, it } from 'vitest'
import type { Memo } from '../types'
import { buildIndex } from './indexer'
import { search } from './search'

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

describe('search', () => {
  it('クエリを含むメモだけを返す', () => {
    const memos = [
      makeMemo({ id: 'a', title: 'rebaseの使い方' }),
      makeMemo({ id: 'b', title: '無関係な内容' }),
    ]
    const index = buildIndex(memos)

    const results = search('rebase', memos, index)

    expect(results.map((r) => r.memo.id)).toEqual(['a'])
  })

  it('出現回数が多いメモほど高いスコアで上位に来る', () => {
    const memos = [
      makeMemo({ id: 'low', title: 'git' }),
      makeMemo({ id: 'high', title: 'git git git' }),
    ]
    const index = buildIndex(memos)

    const results = search('git', memos, index)

    expect(results.map((r) => r.memo.id)).toEqual(['high', 'low'])
    expect(results[0].score).toBeGreaterThan(results[1].score)
  })

  it('空文字のクエリは空配列を返す', () => {
    const memos = [makeMemo({ id: 'a', title: 'git' })]
    const index = buildIndex(memos)

    expect(search('', memos, index)).toEqual([])
    expect(search('   ', memos, index)).toEqual([])
  })

  it('どのメモにも含まれないクエリは空配列を返す', () => {
    const memos = [makeMemo({ id: 'a', title: 'git' })]
    const index = buildIndex(memos)

    expect(search('docker', memos, index)).toEqual([])
  })

  it('クエリトークンの一致率が低いメモは、一部のトークンが偶然一致してもノイズとして除外する', () => {
    const memos = [
      makeMemo({ id: 'relevant', title: 'git rebase' }),
      // "async"は"rebase"のbi-gram"as"を、"await"は"it"の並びをたまたま含むが、
      // 一致するのは5トークン中1つだけなのでノイズとして除外されるべき
      makeMemo({ id: 'noisy', title: 'async await' }),
    ]
    const index = buildIndex(memos)

    const results = search('rebase', memos, index)

    expect(results.map((r) => r.memo.id)).toEqual(['relevant'])
  })

  it('全メモに共通するトークンでも一致は反映される(idfが0にならない)', () => {
    const memos = [
      makeMemo({ id: 'a', title: 'git commit' }),
      makeMemo({ id: 'b', title: 'git push' }),
    ]
    const index = buildIndex(memos)

    const results = search('git', memos, index)

    expect(results).toHaveLength(2)
    expect(results[0].score).toBeGreaterThan(0)
  })
})
