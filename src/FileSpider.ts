/* Copyright © 2022 Seneca Project Contributors, MIT License. */
import fg from 'fast-glob'
import path from 'path'
import fs from 'fs'

type FilespiderOptions = {
  debug?: boolean
  meta: string
  body: string
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
    const res = await fg.glob('*.md', { cwd: homedir, stats: true })

    for (let i = 0; i < res.length; i++) {
      let docmeta = await seneca
        .entity(options.meta)
        .data$({
          kind: 'file',
          name: res[i].name,
          path: res[i].path,
          relpath: homedir + res[i].path,
          size: res[i].stats?.size,
        })
        .save$()
    }

    let pages = await seneca.entity(options.meta).list$()
    console.log('pages:', pages)
  }
}

const defaults: FilespiderOptions = {
  debug: false,
  meta: 'doc/meta',
  body: 'doc/body',
}

Object.assign(FileSpider, { defaults })

export default FileSpider

if ('undefined' !== typeof module) {
  module.exports = FileSpider
}
