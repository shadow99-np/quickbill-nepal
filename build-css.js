const fs = require('fs');
const postcss = require('postcss');
const tailwind = require('@tailwindcss/postcss');

async function buildCSS() {
  console.log('Building Tailwind CSS bundle...');
  const inputCSS = fs.readFileSync('src/app/globals.css', 'utf8');
  const result = await postcss([tailwind]).process(inputCSS, {
    from: 'src/app/globals.css',
    to: 'src/app/tailwind.css'
  });
  fs.writeFileSync('src/app/tailwind.css', result.css);
  console.log(`✓ Tailwind CSS compiled successfully! Size: ${result.css.length} bytes`);
  console.log(`✓ Contains .bg-white: ${result.css.includes('bg-white')}`);
  console.log(`✓ Contains .rounded-xl: ${result.css.includes('rounded-xl')}`);
}

buildCSS().catch(err => {
  console.error(err);
  process.exit(1);
});
