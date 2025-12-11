import GLib from "gi://GLib"

const [filename] = GLib.filename_from_uri(import.meta.url)
const libDir = GLib.path_get_dirname(filename!)
const rootDir = GLib.path_get_dirname(libDir)
const PALETTE_PATH = `${rootDir}/palette.css`

let cachedPalette: Record<string, string> | null = null

function readFile(path: string): string {
  const [success, content] = GLib.file_get_contents(path)
  if (!success) {
    throw new Error(`Could not read file: ${path}`)
  }
  // @ts-ignore
  return new TextDecoder().decode(content)
}

export function getPalette(): Record<string, string> {
  if (cachedPalette) return cachedPalette

  try {
    const content = readFile(PALETTE_PATH)
    const palette: Record<string, string> = {}
    const regex = /(--[\w-]+):\s*([^;]+)/g
    let match
    while ((match = regex.exec(content)) !== null) {
      palette[match[1]] = match[2].trim()
    }
    cachedPalette = palette
    return palette
  } catch (e) {
    console.error(`[Palette] Failed to read palette from ${PALETTE_PATH}`, e)
    return {}
  }
}

export function getPaletteColors(): string[] {
  return Object.keys(getPalette())
}

export function getRandomPaletteColor(): string | undefined {
  const colors = getPaletteColors()
  if (colors.length === 0) return undefined
  return colors[Math.floor(Math.random() * colors.length)]
}

export function getRandomPaletteColorValue(): string | undefined {
  const palette = getPalette()
  const colors = Object.values(palette)
  if (colors.length === 0) return undefined
  return colors[Math.floor(Math.random() * colors.length)]
}

export function getRandomPaletteEntry():
  | { name: string; value: string }
  | undefined {
  const palette = getPalette()
  const keys = Object.keys(palette)
  if (keys.length === 0) return undefined
  const key = keys[Math.floor(Math.random() * keys.length)]
  return { name: key, value: palette[key] }
}
