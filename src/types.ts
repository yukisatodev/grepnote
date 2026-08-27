export interface Memo {
  id: string
  title: string
  body: string
  tags: string[]
  createdAt: number
}

export interface MemoInput {
  title: string
  body: string
  tags: string[]
}
