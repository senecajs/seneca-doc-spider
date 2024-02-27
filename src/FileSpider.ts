/* Copyright © 2022 Seneca Project Contributors, MIT License. */
import fg from 'fast-glob'
import path from 'path'
import fs from 'fs'

type FileSpiderOptionsFull = {
  debug?: boolean
  canon: {
    zone: string | undefined
    base: string | undefined
    name: string | undefined
  }
  MetaEnt: string
  BodyEnt: string
}

export type FileSpiderOptions = Partial<FileSpiderOptionsFull>

function FileSpider(this: any, options: FileSpiderOptionsFull) {
  const seneca: any = this

  const canon =
    ('string' === typeof options.canon.zone ? options.canon.zone : '-') +
    '/' +
    ('string' === typeof options.canon.base ? options.canon.base : '-') +
    '/' +
    ('string' === typeof options.canon.name ? options.canon.name : '-')

  seneca
    .fix('sys:spider,spider:file')

    .message('start:crawl', {}, msgStartCrawl)
    .message('update:doc', { key: String }, msgUpdateDoc)

  async function msgStartCrawl(this: any, msg: any) {
    const seneca = this

    let homedir = '../../resource/handbook/'
    // const res = await fg.glob('**/*.md', { cwd: homedir })
    const res = await fg.glob('*.md', { cwd: homedir, stats: true })

    for (let i = 0; i < res.length; i++) {
      let docmeta = await seneca
        .entity(options.MetaEnt)
        .data$({
          kind: 'file',
          name: res[i].name,
          path: res[i].path,
          relpath: homedir + res[i].path,
          size: res[i].stats?.size,
        })
        .save$()

      // id$:docmeta.id
      // sys:spider,spider:<kind>,update:doc,id:<doc-id>
      // seneca.post('update:doc,id:' + docmeta.id, msgUpdateDoc)
      seneca.post('update:doc', msgUpdateDoc)
    }

    let pages = await seneca.entity(options.MetaEnt).list$()
    console.log('pages:', pages)
  }

  async function msgUpdateDoc(this: any, msg: any) {
    const seneca = this

    const key = msg.key
    // const entry = await seneca.entity(canon).load$(key)

    //let docbody = await seneca.entity('doc/body').data$({id$:docmeta.id, content:'...text...'}).save$()
    await seneca.entity(options.BodyEnt).data$({ msg: msg }).save$()

    let content = await seneca.entity(options.BodyEnt).list$()
    console.log('content:', content)
  }
}

const defaults: FileSpiderOptions = {
  debug: false,

  canon: {
    zone: undefined,
    base: 'sys',
    name: 'spider',
  },

  MetaEnt: 'doc/meta',
  BodyEnt: 'doc/body',
}

Object.assign(FileSpider, { defaults })

export default FileSpider

if ('undefined' !== typeof module) {
  module.exports = FileSpider
}
