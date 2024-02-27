"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
const fast_glob_1 = __importDefault(require("fast-glob"));
function FileSpider(options) {
    const seneca = this;
    const canon = ('string' === typeof options.canon.zone ? options.canon.zone : '-') +
        '/' +
        ('string' === typeof options.canon.base ? options.canon.base : '-') +
        '/' +
        ('string' === typeof options.canon.name ? options.canon.name : '-');
    seneca
        .fix('sys:spider,spider:file')
        .message('start:crawl', {}, msgStartCrawl)
        .message('update:doc', { key: String }, msgUpdateDoc);
    async function msgStartCrawl(msg) {
        var _a;
        const seneca = this;
        let homedir = '../../resource/handbook/';
        // const res = await fg.glob('**/*.md', { cwd: homedir })
        const res = await fast_glob_1.default.glob('*.md', { cwd: homedir, stats: true });
        for (let i = 0; i < res.length; i++) {
            let docmeta = await seneca
                .entity(options.MetaEnt)
                .data$({
                kind: 'file',
                name: res[i].name,
                path: res[i].path,
                relpath: homedir + res[i].path,
                size: (_a = res[i].stats) === null || _a === void 0 ? void 0 : _a.size,
            })
                .save$();
            // id$:docmeta.id
            // sys:spider,spider:<kind>,update:doc,id:<doc-id>
            // seneca.post('update:doc,id:' + docmeta.id, msgUpdateDoc)
            seneca.post('update:doc', msgUpdateDoc);
        }
        let pages = await seneca.entity(options.MetaEnt).list$();
        console.log('pages:', pages);
    }
    async function msgUpdateDoc(msg) {
        const seneca = this;
        const key = msg.key;
        // const entry = await seneca.entity(canon).load$(key)
        //let docbody = await seneca.entity('doc/body').data$({id$:docmeta.id, content:'...text...'}).save$()
        await seneca.entity(options.BodyEnt).data$({ msg: msg }).save$();
        let content = await seneca.entity(options.BodyEnt).list$();
        console.log('content:', content);
    }
}
const defaults = {
    debug: false,
    canon: {
        zone: undefined,
        base: 'sys',
        name: 'spider',
    },
    MetaEnt: 'doc/meta',
    BodyEnt: 'doc/body',
};
Object.assign(FileSpider, { defaults });
exports.default = FileSpider;
if ('undefined' !== typeof module) {
    module.exports = FileSpider;
}
//# sourceMappingURL=FileSpider.js.map