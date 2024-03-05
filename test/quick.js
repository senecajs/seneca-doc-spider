const Seneca = require('seneca')
const FileSpider = require('../dist/FileSpider')

run()

async function run() {
  const seneca = await Seneca({ legacy: false, timeout: 99999 })
    .test('print')
    .use('promisify')
    .use('entity')
    .use(FileSpider)

  const res0 = await seneca.post('sys:spider,spider:file,start:crawl')
  console.log('res0:', res0)
}
