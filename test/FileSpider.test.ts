/* Copyright © 2022 Seneca Project Contributors, MIT License. */

import Seneca from 'seneca'

import FilespiderDoc from '../src/FileSpiderDoc'
import Filespider from '../src/FileSpider'

describe('filespider', () => {
  test('load-plugin', async () => {
    expect(FilespiderDoc).toBeDefined()
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use(Filespider)
    await seneca.ready()
  })

  test('basic', async () => {
    const seneca = await makeSeneca()

    const res0 = await seneca.post('sys:spider,spider:file,start:crawl')
    console.log('res0:', res0)
    // expect(res0).toMatchObject({})
  }, 99999)
})

async function makeSeneca() {
  const seneca = Seneca({ legacy: false, timeout: 99999 })
    .test()
    .use('promisify')
    .use('entity')
    .use('entity-util', { when: { active: true } })
    .use(Filespider)
  return seneca
}
