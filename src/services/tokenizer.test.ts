import { describe, expect, it } from 'vitest'
import { tokenize } from './tokenizer'

describe('tokenize', () => {
  it('日本語のまとまりをbi-gramに分割する', () => {
    expect(tokenize('型注釈')).toEqual(['型注', '注釈'])
  })

  it('英語は小文字化してからbi-gramに分割する', () => {
    expect(tokenize('Go')).toEqual(['go'])
    expect(tokenize('Vue')).toEqual(['vu', 'ue'])
  })

  it('記号や空白はトークンの区切りとして扱い、またがせない', () => {
    expect(tokenize('foo.bar()')).toEqual(['fo', 'oo', 'ba', 'ar'])
  })

  it('日本語と英語が混在していても、それぞれ独立に分割する', () => {
    expect(tokenize('TS型')).toEqual(['ts', '型'])
  })

  it('1文字の単語はbi-gramを作らずそのまま1トークンにする', () => {
    expect(tokenize('駅')).toEqual(['駅'])
  })

  it('全角英数字はNFKC正規化で半角として扱われる', () => {
    expect(tokenize('ＴＳ')).toEqual(['ts'])
  })

  it('空文字列や記号のみの入力は空配列を返す', () => {
    expect(tokenize('')).toEqual([])
    expect(tokenize('...!!!')).toEqual([])
  })

  it('カタカナの長音記号を含む単語をひとまとまりとして扱う', () => {
    expect(tokenize('コンピューター')).toEqual([
      'コン',
      'ンピ',
      'ピュ',
      'ュー',
      'ータ',
      'ター',
    ])
  })
})
