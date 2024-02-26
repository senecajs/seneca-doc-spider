/* Copyright © 2022 Seneca Project Contributors, MIT License. */

import Seneca from 'seneca'

import FilespiderDoc from '../src/FileSpider-doc'
import Filespider from '../src/FileSpider'

describe('filespider', () => {
  test('happy', async () => {
    expect(FilespiderDoc).toBeDefined()
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use(Filespider)
    await seneca.ready()
  })

  test('file-spider', async () => {
    const seneca = makeSeneca()
  })
})

async function makeSeneca() {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use('entity-util', { when: { active: true } })

  seneca.use(Filespider)

  await seneca.ready()

  console.log(seneca.list())

  return seneca
}
