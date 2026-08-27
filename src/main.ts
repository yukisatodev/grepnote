import './style.css'
import { memoApi } from './api/memoClient'
import { renderBrowseList, renderSearchResultList } from './ui/memoListView'

const searchInput = document.querySelector<HTMLInputElement>('#search-input')!
const resultSummary = document.querySelector<HTMLParagraphElement>('#result-summary')!
const memoListElement = document.querySelector<HTMLUListElement>('#memo-list')!

const toggleFormButton = document.querySelector<HTMLButtonElement>('#toggle-form-button')!
const cancelFormButton = document.querySelector<HTMLButtonElement>('#cancel-form-button')!
const memoForm = document.querySelector<HTMLFormElement>('#memo-form')!
const titleInput = document.querySelector<HTMLInputElement>('#memo-title-input')!
const bodyInput = document.querySelector<HTMLTextAreaElement>('#memo-body-input')!
const tagsInput = document.querySelector<HTMLInputElement>('#memo-tags-input')!

const themeToggleButton = document.querySelector<HTMLButtonElement>('#theme-toggle-button')!
const THEME_STORAGE_KEY = 'grepnote:theme'

type Theme = 'light' | 'dark'

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function getStoredTheme(): Theme | null {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  return isTheme(stored) ? stored : null
}

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function getEffectiveTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme()
}

function updateThemeToggleLabel(): void {
  const nextTheme: Theme = getEffectiveTheme() === 'dark' ? 'light' : 'dark'
  themeToggleButton.textContent = `[${nextTheme}]`
  themeToggleButton.setAttribute('aria-label', `${nextTheme === 'light' ? 'ライト' : 'ダーク'}モードに切り替える`)
}

function applyTheme(theme: Theme | null): void {
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme)
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  updateThemeToggleLabel()
}

function toggleTheme(): void {
  const nextTheme: Theme = getEffectiveTheme() === 'dark' ? 'light' : 'dark'
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  applyTheme(nextTheme)
}

const taglineText = document.querySelector<HTMLSpanElement>('.tagline-text')!
const TAGLINE = '散らばった技術メモを、自作の検索エンジンで見つける'
const TYPE_INTERVAL_MS = 35

function playTaglineTypewriter(): void {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    taglineText.textContent = TAGLINE
    return
  }

  let charCount = 0
  const timer = window.setInterval(() => {
    charCount += 1
    taglineText.textContent = TAGLINE.slice(0, charCount)
    if (charCount >= TAGLINE.length) window.clearInterval(timer)
  }, TYPE_INTERVAL_MS)
}

function parseTags(rawTags: string): string[] {
  return rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}

function renderResults(): void {
  const query = searchInput.value.trim()

  if (query.length === 0) {
    const memos = memoApi.list()
    resultSummary.textContent = `${memos.length}件のメモ`
    memoListElement.innerHTML = renderBrowseList(memos)
    return
  }

  const results = memoApi.search(query)
  resultSummary.textContent = `「${query}」の検索結果: ${results.length}件`
  memoListElement.innerHTML = renderSearchResultList(results, query)
}

function showForm(): void {
  memoForm.hidden = false
  toggleFormButton.hidden = true
  titleInput.focus()
}

function hideForm(): void {
  memoForm.hidden = true
  toggleFormButton.hidden = false
  memoForm.reset()
}

function handleFormSubmit(event: SubmitEvent): void {
  event.preventDefault()

  memoApi.create({
    title: titleInput.value.trim(),
    body: bodyInput.value.trim(),
    tags: parseTags(tagsInput.value),
  })

  hideForm()
  searchInput.value = ''
  renderResults()
}

function handleMemoListClick(event: MouseEvent): void {
  const target = event.target
  if (!(target instanceof HTMLElement)) return

  const deleteButton = target.closest<HTMLButtonElement>('.delete-memo-button')
  if (!deleteButton?.dataset.memoId) return

  memoApi.remove(deleteButton.dataset.memoId)
  renderResults()
}

searchInput.addEventListener('input', renderResults)
toggleFormButton.addEventListener('click', showForm)
cancelFormButton.addEventListener('click', hideForm)
memoForm.addEventListener('submit', handleFormSubmit)
memoListElement.addEventListener('click', handleMemoListClick)
themeToggleButton.addEventListener('click', toggleTheme)

applyTheme(getStoredTheme())
renderResults()
playTaglineTypewriter()
