import { writeFileSync, mkdirSync } from 'fs'

const createSVG = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="#ef4444"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.35}" fill="none" stroke="white" stroke-width="${size*0.04}"/>
  <line x1="${size/2}" y1="${size/2}" x2="${size/2}" y2="${size*0.2}" stroke="white" stroke-width="${size*0.04}" stroke-linecap="round"/>
  <line x1="${size/2}" y1="${size/2}" x2="${size*0.7}" y2="${size*0.6}" stroke="white" stroke-width="${size*0.04}" stroke-linecap="round"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size*0.03}" fill="white"/>
</svg>`

mkdirSync('public/icons', { recursive: true })
writeFileSync('public/icons/icon-192x192.svg', createSVG(192))
writeFileSync('public/icons/icon-512x512.svg', createSVG(512))
console.log('SVG icons created!')
