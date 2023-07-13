import { build } from 'esbuild'
import { sassPlugin } from 'esbuild-sass-plugin'
// import postcssParentSelector from 'postcss-parent-selector'

build({
  bundle: true,
  entryPoints: ['./src/index.ts'],
  external: [
    'react',
    'uuid',
    'nedb',
  ],
  format: 'cjs',
  outfile: './dist/index.js',
  watch: Boolean(process.env.ESBUILD_WATCH),
  platform: 'node',
  plugins: [
    sassPlugin({
      type: 'style'
    }),
  ],
})
