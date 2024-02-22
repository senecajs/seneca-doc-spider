/* Copyright © 2022 Seneca Project Contributors, MIT License. */

import Seneca from 'seneca'
import SenecaMsgTest from 'seneca-msg-test'
// import { Maintain } from '@seneca/maintain'

import DocspiderDoc from '../src/doc-spider-doc'
import Docspider from '../src/doc-spider'

import BasicMessages from './basic.messages'
import ManyMessages from './many.messages'
import ConflictMessages from './conflict.messages'
import InviteMessages from './invite.messages'

describe('docspider', () => {
  test('happy', async () => {
    expect(DocspiderDoc).toBeDefined()
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use(Docspider)
    await seneca.ready()
  })

  test('gen', async () => {
    const seneca = Seneca({ legacy: false })
      .test()
      .use('promisify')
      .use('entity')
      .use(Docspider)
    await seneca.ready()

    let genToken = seneca.export('docspider/genToken')
    let genCode = seneca.export('docspider/genCode')

    expect(genToken().length).toEqual(16)
    expect(genCode().length).toEqual(6)
  })

  test('basic.messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, BasicMessages)()
  })

  test('many.messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, ManyMessages)()
  })

  test('conflict.messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, ConflictMessages)()
  })

  test('invite.messages', async () => {
    const seneca = await makeSeneca()
    await SenecaMsgTest(seneca, InviteMessages)()
  })

  // test('maintain', Maintain)
})

async function makeSeneca() {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use('entity-util', { when: { active: true } })

  await makeBasicRules(seneca)

  seneca.use(Docspider)

  await makeMockActions(seneca)

  await seneca.ready()

  // print all message patterns
  // console.log(seneca.list())

  return seneca
}

async function makeBasicRules(seneca: any) {
  await seneca.entity('docspider/rule').save$({
    ent: 'docspider/occur',
    cmd: 'save',
    where: { kind: 'create' },
    call: [
      {
        sys: 'email',
        send: 'email',
        fromaddr: '`config:sender.invite.email`',
        subject: '`config:sender.invite.subject`',
        toaddr: '`occur:sender.invite.subject`',
        code: 'invite',
        kind: 'docspider',
      },
    ],
  })

  await seneca.entity('docspider/rule').save$({
    ent: 'docspider/occur',
    cmd: 'save',
    where: { kind: 'accept' },
    call: [
      {
        kind: 'accept',
        award: 'incr',
        field: 'count',
        give: 'award',
        biz: 'docspider',
      },
    ],
  })

  await seneca.entity('docspider/rule').save$({
    ent: 'docspider/occur',
    cmd: 'save',
    where: { kind: 'lost' },
    call: [
      {
        lost: 'entry',
        biz: 'docspider',
      },
    ],
  })
}

async function makeMockActions(seneca: any) {
  seneca.message('sys:email,send:email', async function (this: any, msg: any) {
    this.entity('mock/email').save$({
      toaddr: msg.toaddr,
      fromaddr: msg.fromaddr,
      subject: msg.subject,
      kind: msg.kind,
      code: msg.code,
      what: 'sent',
    })
  })
}
