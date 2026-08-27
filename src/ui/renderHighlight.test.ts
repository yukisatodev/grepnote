import { describe, expect, it } from 'vitest'
import { renderHighlightedText } from './renderHighlight'

describe('renderHighlightedText', () => {
  it('ハイライト範囲がなければエスケープ済みのテキストをそのまま返す', () => {
    expect(renderHighlightedText({ text: 'plain text', ranges: [] })).toBe('plain text')
  })

  it('危険なHTML文字を含むテキストをエスケープする(XSS対策)', () => {
    const html = renderHighlightedText({ text: '<script>alert(1)</script>', ranges: [] })

    expect(html).not.toContain('<script>')
    expect(html).toBe('&lt;script&gt;alert(1)&lt;/script&gt;')
  })

  it('ハイライト範囲を<mark>で囲む', () => {
    const html = renderHighlightedText({ text: 'git rebase', ranges: [{ start: 4, end: 10 }] })

    expect(html).toBe('git <mark>rebase</mark>')
  })

  it('ハイライト範囲の前後に危険な文字があっても、範囲ごとに正しくエスケープする', () => {
    const html = renderHighlightedText({
      text: '<b>rebase</b>',
      ranges: [{ start: 3, end: 9 }],
    })

    expect(html).toBe('&lt;b&gt;<mark>rebase</mark>&lt;/b&gt;')
  })
})
