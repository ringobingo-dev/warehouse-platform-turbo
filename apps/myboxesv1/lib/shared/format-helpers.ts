export function formatDimensions(width: number, height: number, depth: number) {
  return `${width}x${height}x${depth}`
}

export function formatVolume(width: number, height: number, depth: number) {
  const volume = width * height * depth
  return `${volume} cubic units`
}

export function formatUtilization(used: number, total: number) {
  const percentage = (used / total) * 100
  return `${percentage.toFixed(1)}%`
} 