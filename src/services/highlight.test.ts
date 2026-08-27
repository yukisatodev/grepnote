import { describe, expect, it } from 'vitest'
import { buildHighlightedExcerpt } from './highlight'

describe('buildHighlightedExcerpt', () => {
  it('マッチしない場合、ハイライトなしで本文をそのまま返す(短文なら省略記号も付かない)', () => {
    const result = buildHighlightedExcerpt('これは短い文章です', '存在しないキーワード')

    expect(result).toEqual({ text: 'これは短い文章です', ranges: [] })
  })

  it('マッチが見つかった範囲をハイライト区間として返す', () => {
    const result = buildHighlightedExcerpt('gitのrebaseについて', 'rebase')

    expect(result.text).toBe('gitのrebaseについて')
    expect(result.ranges).toEqual([{ start: 4, end: 10 }])
    expect(result.text.slice(result.ranges[0].start, result.ranges[0].end)).toBe('rebase')
  })

  it('隣接・重複する複数のヒット区間を1つにマージする', () => {
    // "rebase" は "re","eb","ba","as","se" の5つのbi-gramに割れるが、
    // 連続した1つの単語である以上ハイライトも1区間にまとまるべき
    const result = buildHighlightedExcerpt('rebase', 'rebase')

    expect(result.ranges).toEqual([{ start: 0, end: 6 }])
  })

  it('マッチ位置が本文の中ほどにある場合、前後を省略記号付きで切り出す', () => {
    const text = 'x'.repeat(60) + 'rebase' + 'y'.repeat(60)

    const result = buildHighlightedExcerpt(text, 'rebase')

    expect(result.text.startsWith('…')).toBe(true)
    expect(result.text.endsWith('…')).toBe(true)
    const [range] = result.ranges
    expect(result.text.slice(range.start, range.end)).toBe('rebase')
  })

  it('マッチが本文の先頭付近にある場合、先頭側には省略記号を付けない', () => {
    const text = 'rebase' + 'y'.repeat(60)

    const result = buildHighlightedExcerpt(text, 'rebase')

    expect(result.text.startsWith('…')).toBe(false)
    expect(result.text.endsWith('…')).toBe(true)
  })
})
