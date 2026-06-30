import sharp from 'sharp'
import { mkdirSync } from 'fs'

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="50" fill="#ef4444"/>
  <circle cx="50" cy="50" r="35" fill="none" stroke="white" stroke-width="4"/>
  <line x1="50" y1="50" x2="50" y2="20" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="50" x2="70" y2="60" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="3" fill="white"/>
</svg>`

mkdirSync('public/icons', { recursive: true })

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
for (const size of sizes) {
  await sharp(Buffer.from(SVG))
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}x${size}.png`)
  console.log(`Generated ${size}x${size}`)
}
console.log('All icons generated!')
