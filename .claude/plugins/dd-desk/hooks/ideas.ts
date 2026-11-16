import type { Idea } from '../types'

export const IDEAS_FILE = 'ideas/ideas.json'

// The ideas still in play, newest first; a rejected idea stays in the file so Claude never suggests it again.
export function activeIdeas(text: string): Idea[] {
  try {
    const all = JSON.parse(text) as Idea[]

    return all.filter(idea => idea.status !== 'avvist' && idea.status !== 'skrevet').sort((a, b) => b.added.localeCompare(a.added))
  } catch {
    return []
  }
}

// Changes one idea's status and keeps the file's form: two-space JSON, UTF-8, a closing newline.
export function withStatus(text: string, id: string, status: Idea['status']): string {
  const all = JSON.parse(text) as Idea[]

  return `${JSON.stringify(all.map(idea => (idea.id === id ? { ...idea, status } : idea)), null, 2)}\n`
}

// A post path as a short label: the slug without its date, and "nb" for the Norwegian page.
export function shortPath(path: string): string {
  const post = /^\/(nb\/)?blog\/\d{4}-\d{2}-\d{2}-([^/]+)\/$/.exec(path)
  if (post) {
    return `${post[1] ? 'nb: ' : ''}${post[2]}`
  }

  return path === '/' ? 'forsiden' : path === '/nb/' ? 'nb: forsiden' : path
}
