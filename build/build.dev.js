const Bundler = require('parcel-bundler');
const Path = require('path');
const baseOptions = require('./build.base');

// 单个入口文件路径
const entryFiles = Path.join(__dirname, '../test/index.html');

// Bundler 选项
const options = {
  outDir: './dist', // 将生成的文件放入输出目录下，默认为 dist
  outFile: 'index.html', // 输出文件的名称
  watch: true, // 是否需要监听文件并在发生改变时重新编译它们，默认为 process.env.NODE_ENV !== 'production'
  hmr: true, // 开启或禁止HRM
  sourceMaps: true, // 启用或禁用 sourcemaps，默认为启用(在精简版本中不支持)
  contentHash: true
};

(async function() {
  const bundler = new Bundler(entryFiles, Object.assign(baseOptions, options));
  console.log(bundler);
  await bundler.serve();
})();