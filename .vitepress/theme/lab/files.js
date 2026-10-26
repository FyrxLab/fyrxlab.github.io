export function downloadText(name, value) {
  const url = URL.createObjectURL(new Blob([value], { type: 'text/yaml;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
