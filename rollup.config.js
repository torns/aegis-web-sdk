import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import cleanup from 'rollup-plugin-cleanup'
import { minify } from 'uglify-es'

export default [{
    input: './src/index.js',
    output: {
        file: `./dist/index.js`,
        format: 'umd',
        exports: 'named',
        name: 'wardjs-speed-report',
        sourceMap: false
    },
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        uglify({}, minify),
        cleanup({
            comments: 'none'
        })
    ]
}]
