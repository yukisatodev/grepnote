/**
 * 英数字のまとまりと、かな/カナ/漢字のまとまりを別パターンにしているのは、
 * 1つの文字クラスにまとめると「TS型」のような英数字と日本語の連続部分が
 * 文字種をまたいだ1単語として抽出されてしまうため(実際にテストで検出した)。
 * 記号や空白は単語の区切りとして扱う(コード中の `.` や `()` でトークンが
 * 不自然に連結しないようにするため)。
 */
const WORD_PATTERN = /[a-z0-9]+|[ぁ-んァ-ヶー一-龠]+/g

function normalize(text: string): string {
  // 全角/半角の表記ゆれと大文字小文字の違いを、検索前に吸収する
  return text.normalize('NFKC').toLowerCase()
}

function extractWords(normalizedText: string): string[] {
  return normalizedText.match(WORD_PATTERN) ?? []
}

function toBigrams(word: string): string[] {
  // 1文字はbi-gramを作れないため、単漢字などの検索を諦めずそのまま1トークンにする
  if (word.length <= 1) return [word]

  const bigrams: string[] = []
  for (let i = 0; i < word.length - 1; i++) {
    bigrams.push(word.slice(i, i + 2))
  }
  return bigrams
}

export function tokenize(text: string): string[] {
  const words = extractWords(normalize(text))
  return words.flatMap(toBigrams)
}
