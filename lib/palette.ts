import paletteContent from "../palette.css"

let cachedPalette: Record<string, string> | null = null

export function getPalette(): Record<string, string> {
  if (cachedPalette) return cachedPalette

  try {
    const content = paletteContent
    const palette: Record<string, string> = {}
    const regex = /(--[\w-]+):\s*([^;]+)/g
    let match
    while ((match = regex.exec(content)) !== null) {
      palette[match[1]] = match[2].trim()
    }
    cachedPalette = palette
    return palette
  } catch (e) {
    console.error(`[Palette] Failed to parse palette`, e)
    return {}
  }
}

export function getPaletteColors(): string[] {
  return Object.keys(getPalette())
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
