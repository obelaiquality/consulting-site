// Builds public/og.png (1200x630) for social/link previews.
//
// The Obel MS wordmark + pillar mark are pre-drawn SVG path/polygon data (traced from
// src/components/ui/Logo.astro), so they render correctly regardless of which fonts are
// installed. The headline is plain SVG <text>, which is not font-independent: this box has
// no fontconfig-registered fonts at all (`fc-list` returns zero entries), so an embedded
// Syne woff2 via base64 @font-face was tested and silently fell back to librsvg's bundled
// generic sans — see the test image, it did not pick up Syne's distinctive letterforms.
// We accept that fallback deliberately (a clean bold system sans) rather than ship a font
// that visibly isn't Syne under a Syne-branded @font-face declaration.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '..', 'public', 'og.png');

const WIDTH = 1200;
const HEIGHT = 630;
const PAPER = '#f8f8f6';
const INK = '#111110';
const MUTED = '#78786e';
const GREEN = '#166534';

// Obel MS lockup (mark + word), traced from src/components/ui/Logo.astro.
// Native viewBox is "130 125 940 230" — rendered here as a nested <svg> so it scales cleanly
// without any transform-origin math.
const LOGO_PATHS = `
  <polygon points="137.681,146.000 167.681,130.000 167.681,350.000 137.681,350.000"/>
  <rect x="189.681" y="130.000" width="30" height="220"/>
  <path d="M 350.181 202.255 Q 336.775 202.255 329.389 212.151 Q 322.004 222.048 322.004 240.037 Q 322.004 257.928 329.389 267.849 Q 336.775 277.745 350.181 277.745 Q 363.661 277.745 371.046 267.849 Q 378.432 257.928 378.432 240.037 Q 378.432 222.048 371.046 212.151 Q 363.661 202.255 350.181 202.255 Z M 350.181 181.000 Q 377.603 181.000 393.130 196.698 Q 408.682 212.371 408.682 240.037 Q 408.682 267.605 393.130 283.302 Q 377.603 299.000 350.181 299.000 Q 322.832 299.000 307.257 283.302 Q 291.681 267.605 291.681 240.037 Q 291.681 212.371 307.257 196.698 Q 322.832 181.000 350.181 181.000 Z M 476.387 227.093 Q 483.334 227.093 486.892 224.046 Q 490.475 221.000 490.475 215.052 Q 490.475 209.178 486.892 206.106 Q 483.334 203.011 476.387 203.011 L 460.177 203.011 L 460.177 227.093 L 476.387 227.093 Z M 477.386 276.819 Q 486.210 276.819 490.670 273.089 Q 495.131 269.360 495.131 261.828 Q 495.131 254.418 490.719 250.737 Q 486.307 247.032 477.386 247.032 L 460.177 247.032 L 460.177 276.819 L 477.386 276.819 Z M 504.662 235.917 Q 514.095 238.672 519.262 246.057 Q 524.454 253.443 524.454 264.168 Q 524.454 280.621 513.339 288.714 Q 502.224 296.782 479.507 296.782 L 430.854 296.782 L 430.854 183.048 L 474.875 183.048 Q 498.568 183.048 509.196 190.214 Q 519.823 197.380 519.823 213.151 Q 519.823 221.438 515.923 227.264 Q 512.047 233.090 504.662 235.917 Z M 549.759 183.048 L 628.880 183.048 L 628.880 205.229 L 579.082 205.229 L 579.082 226.386 L 625.931 226.386 L 625.931 248.568 L 579.082 248.568 L 579.082 274.625 L 630.562 274.625 L 630.562 296.782 L 549.759 296.782 L 549.759 183.048 Z M 656.324 183.048 L 685.647 183.048 L 685.647 274.625 L 737.127 274.625 L 737.127 296.782 L 656.324 296.782 L 656.324 183.048 Z M 749.854 240.792 L 797.678 240.792 L 797.678 262.949 L 749.854 262.949 L 749.854 240.792 Z M 820.475 183.048 L 857.793 183.048 L 883.680 243.912 L 909.737 183.048 L 946.982 183.048 L 946.982 296.782 L 919.267 296.782 L 919.267 213.590 L 893.064 274.917 L 874.466 274.917 L 848.263 213.590 L 848.263 296.782 L 820.475 296.782 L 820.475 183.048 Z M 1054.836 186.631 L 1054.836 210.713 Q 1045.476 206.521 1036.554 204.400 Q 1027.658 202.255 1019.736 202.255 Q 1009.230 202.255 1004.184 205.156 Q 999.163 208.032 999.163 214.126 Q 999.163 218.708 1002.551 221.268 Q 1005.939 223.803 1014.861 225.631 L 1027.341 228.141 Q 1046.305 231.968 1054.300 239.744 Q 1062.319 247.495 1062.319 261.828 Q 1062.319 280.621 1051.155 289.811 Q 1039.991 299.000 1017.054 299.000 Q 1006.256 299.000 995.361 296.928 Q 984.465 294.881 973.569 290.834 L 973.569 266.094 Q 984.465 271.870 994.629 274.820 Q 1004.794 277.745 1014.251 277.745 Q 1023.855 277.745 1028.949 274.552 Q 1034.044 271.334 1034.044 265.387 Q 1034.044 260.073 1030.583 257.172 Q 1027.121 254.272 1016.762 251.980 L 1005.403 249.470 Q 988.340 245.813 980.443 237.818 Q 972.570 229.823 972.570 216.271 Q 972.570 199.281 983.539 190.141 Q 994.507 181.000 1015.080 181.000 Q 1024.464 181.000 1034.361 182.414 Q 1044.257 183.828 1054.836 186.631 Z"/>
`;

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="${INK}" opacity="0.08" />
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#dots)" />

  <!-- Obel MS lockup, top-left -->
  <svg x="80" y="72" width="300" height="73.4" viewBox="130 125 940 230">
    <g fill="${INK}">${LOGO_PATHS}</g>
  </svg>

  <!-- Eyebrow label -->
  <circle cx="84" cy="230" r="5" fill="${GREEN}" />
  <text x="100" y="236" font-family="${FONT}" font-weight="600" font-size="16" fill="${INK}">Hosted document control for ISO 9001</text>

  <!-- Headline -->
  <text x="80" y="322" font-family="${FONT}" font-weight="700" font-size="60" letter-spacing="-1.5" fill="${INK}">ISO 9001 document control,</text>
  <text x="80" y="392" font-family="${FONT}" font-weight="700" font-size="60" letter-spacing="-1.5" fill="${INK}">without the ISO 9001</text>
  <text x="80" y="462" font-family="${FONT}" font-weight="700" font-size="60" letter-spacing="-1.5" fill="${INK}">price tag.</text>

  <!-- Footer -->
  <line x1="80" y1="540" x2="1120" y2="540" stroke="${INK}" stroke-opacity="0.12" stroke-width="1" />
  <text x="80" y="580" font-family="${FONT}" font-weight="500" font-size="20" fill="${MUTED}">obel-ai.com</text>
  <text x="1120" y="580" font-family="${FONT}" font-weight="500" font-size="20" fill="${MUTED}" text-anchor="end">External Document Control and Workflow Manager</text>
</svg>
`;

const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
writeFileSync(outPath, buffer);

const meta = await sharp(buffer).metadata();
console.log(`Wrote ${outPath} (${meta.width}x${meta.height})`);
