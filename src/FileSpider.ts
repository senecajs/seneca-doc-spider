/* Copyright © 2022 Seneca Project Contributors, MIT License. */
import fg from 'fast-glob'
import { readFile } from 'fs'

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
    .message('update:doc', { id: String }, msgUpdateDoc)

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

      seneca.post('sys:spider,spider:file,update:doc,id:' + docmeta.id)
    }

    let meta = await seneca.entity(options.MetaEnt).list$()
    console.log('meta:', meta)
  }

  async function msgUpdateDoc(this: any, msg: any) {
    const seneca = this

    const docid = msg.id
    const docmeta = await seneca.entity(options.MetaEnt).load$(docid)
    console.log('docmeta', docmeta)

    readFile(docmeta.relpath, 'utf8', (err, data) => {
      if (err) throw err

      seneca
        .entity(options.BodyEnt)
        .data$({ id$: msg.id, content: data })
        .save$()
    })

    // Timeout and log for development purposes only
    await new Promise((resolve) => setTimeout(resolve, 1111))
    let body = await seneca.entity(options.BodyEnt).list$()
    console.log('body:', body)
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
