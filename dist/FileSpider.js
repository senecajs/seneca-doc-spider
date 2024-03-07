"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
const fast_glob_1 = __importDefault(require("fast-glob"));
const fs_1 = require("fs");
// TODO: Generated IDs containing exponents causing problems for saving body - see Issue #3 on GitHub
function FileSpider(options) {
    const seneca = this;
    let metaCanon;
    let bodyCanon;
    seneca
        .fix('sys:spider,spider:file')
        .message('start:crawl', {}, msgStartCrawl)
        .message('update:doc', {}, msgUpdateDoc);
    async function msgStartCrawl(msg) {
        var _a;
        const seneca = this;
        metaCanon = await canonBuilder(options.metaCanon);
        let homedir = '../../resource/handbook/';
        const res = await fast_glob_1.default.glob('**/*.md', { cwd: homedir, stats: true });
        // Non-recursive glob for testing purposes
        // const res = await fg.glob('*.md', { cwd: homedir, stats: true })
        for (let i = 0; i < res.length; i++) {
            let docmeta = await seneca
                .entity(metaCanon)
                .data$({
                kind: 'file',
                name: res[i].name,
                path: res[i].path,
                relpath: homedir + res[i].path,
                size: (_a = res[i].stats) === null || _a === void 0 ? void 0 : _a.size,
            })
                .save$();
            // console.log('docmeta:', docmeta)
            // console.log('docmeta.id:', docmeta.id)
            if (docmeta)
                await seneca.post('sys:spider,spider:file,update:doc', { id: docmeta.id });
        }
        // let meta = await seneca.entity(metaCanon).list$()
        // console.log('meta:', meta)
    }
    async function msgUpdateDoc(msg) {
        const seneca = this;
        // console.log('msg:', msg)
        bodyCanon = await canonBuilder(options.bodyCanon);
        const docmeta = await seneca.entity(metaCanon).load$(msg.id);
        // console.log('msg.id:', msg.id)
        // console.log('docmeta load', docmeta)
        // console.log('docmeta.relpath', docmeta.relpath)
        (0, fs_1.readFile)(docmeta.relpath, 'utf8', (err, data) => {
            if (err)
                throw err;
            seneca.entity(bodyCanon).data$({ id$: msg.id, content: data }).save$();
        });
        // Timeout and log for development purposes only
        // await new Promise((resolve) => setTimeout(resolve, 1111))
        // let body = await seneca.entity(bodyCanon).list$()
        // console.log('body:', body)
    }
}
// Utility function inside or outside of FileSpider?
async function canonBuilder(canon) {
    let builtCanon = ('string' === typeof canon.zone ? canon.zone : '-') +
        '/' +
        ('string' === typeof canon.base ? canon.base : '-') +
        '/' +
        ('string' === typeof canon.name ? canon.name : '-');
    return builtCanon;
}
const defaults = {
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
};
Object.assign(FileSpider, { defaults });
exports.default = FileSpider;
if ('undefined' !== typeof module) {
    module.exports = FileSpider;
}
//# sourceMappingURL=FileSpider.js.map