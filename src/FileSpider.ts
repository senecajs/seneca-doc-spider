/* Copyright © 2022 Seneca Project Contributors, MIT License. */
import fg from 'fast-glob'
import path from 'path'
import fs from 'fs'

type FilespiderOptions = {
  debug?: boolean
  canon: string
}

function FileSpider(this: any, options: FilespiderOptions) {
  const seneca: any = this

  seneca
    .fix('sys:spider,spider:file')

    .message('start:crawl', msgStartCrawl)

  async function msgStartCrawl(this: any, msg: any) {
    const seneca = this

    let homedir = '../../resource/handbook/'
    // const res = await fg.glob('**/*.md', { cwd: homedir })
    const res = await fg.glob('*.md', { cwd: homedir })

    for (let i = 0; i < res.length; i++) {
      // Process metadata then save contents?
      // let readStream = fs.createReadStream(homedir + res[i], 'utf8')
      // let fileContents
      // readStream.on('data', function (chunk) {
      //   fileContents = chunk
      // })

      await seneca
        .entity(options.canon)
        .data$({
          file: path.basename(res[i]),
          path: res[i],
          relpath: homedir + res[i],
          content: fs.readFileSync(homedir + res[i], 'utf8'),
        })
        .save$()
    }

    let pages = await seneca.entity(options.canon).list$()
    console.log('pages:', pages)
  }
}

// Default options.
const defaults: FilespiderOptions = {
  // TODO: Enable debug logging
  debug: false,

  canon: 'fsp/page',
}

Object.assign(FileSpider, { defaults })

export default FileSpider

if ('undefined' !== typeof module) {
  module.exports = FileSpider
}
