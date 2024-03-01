/* Copyright © 2022 Seneca Project Contributors, MIT License. */

const docs = {
  messages: {
    msgStartCrawl: {
      desc: 'Start crawl and save meta data.',
    },
    msgUpdateDoc: {
      desc: 'Save body data under meta data id.',
    },
  },
}

export default docs

if ('undefined' !== typeof module) {
  module.exports = docs
}
