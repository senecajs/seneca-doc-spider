/* Copyright © 2022 Seneca Project Contributors, MIT License. */
import fg from 'fast-glob'
import { readFile } from 'fs'

type FileSpiderOptionsFull = {
  debug?: boolean
  metaCanon: {
    zone: string | undefined
    base: string | undefined
    name: string | undefined
  }
  bodyCanon: {
    zone: string | undefined
    base: string | undefined
    name: string | undefined
  }
}

export type FileSpiderOptions = Partial<FileSpiderOptionsFull>

function FileSpider(this: any, options: FileSpiderOptionsFull) {
  const seneca: any = this

  let metaCanon: string
  let bodyCanon: string

  seneca
    .fix('sys:spider,spider:file')

    .message('start:crawl', {}, msgStartCrawl)
    .message('update:doc', { id: String }, msgUpdateDoc)

  async function msgStartCrawl(this: any, msg: any) {
    const seneca = this

    metaCanon = await canonBuilder(options.metaCanon)

    let homedir = '../../resource/handbook/'
    // const res = await fg.glob('**/*.md', { cwd: homedir, stats: true })
    const res = await fg.glob('*.md', { cwd: homedir, stats: true })

    for (let i = 0; i < res.length; i++) {
      // sys:entity,cmd:save,base:doc,name:meta,ent:{kind:_,path:_}
      let docmeta = await seneca
        .entity(metaCanon)
        .data$({
          kind: 'file',
          name: res[i].name,
          path: res[i].path,
          relpath: homedir + res[i].path,
          size: res[i].stats?.size,
        })
        .save$()

      await seneca.post('sys:spider,spider:file,update:doc,id:' + docmeta.id)
    }

    let meta = await seneca.entity(metaCanon).list$()
    console.log('meta:', meta)
  }

  async function msgUpdateDoc(this: any, msg: any) {
    const seneca = this

    bodyCanon = await canonBuilder(options.bodyCanon)

    const docmeta = await seneca.entity(metaCanon).load$(msg.id)

    readFile(docmeta.relpath, 'utf8', (err, data) => {
      if (err) throw err

      seneca.entity(bodyCanon).data$({ id$: msg.id, content: data }).save$()
    })

    // Timeout and log for development purposes only
    await new Promise((resolve) => setTimeout(resolve, 1111))
    let body = await seneca.entity(bodyCanon).list$()
    console.log('body:', body)
  }
}

// Utility function inside or outside of FileSpider?
async function canonBuilder(canon: any) {
  let builtCanon =
    ('string' === typeof canon.zone ? canon.zone : '-') +
    '/' +
    ('string' === typeof canon.base ? canon.base : '-') +
    '/' +
    ('string' === typeof canon.name ? canon.name : '-')
  console.log('builtCanon:', builtCanon)
  return builtCanon
}

const defaults: FileSpiderOptions = {
  debug: false,

  metaCanon: {
    zone: undefined,
    base: 'doc',
    name: 'meta',
  },

  bodyCanon: {
    zone: undefined,
    base: 'doc',
    name: 'body',
  },
}

Object.assign(FileSpider, { defaults })

export default FileSpider

if ('undefined' !== typeof module) {
  module.exports = FileSpider
}
