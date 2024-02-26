"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
const fast_glob_1 = __importDefault(require("fast-glob"));
function FileSpider(options) {
    const seneca = this;
    seneca
        .fix('sys:spider,spider:file')
        .message('start:crawl', msgStartCrawl);
    async function msgStartCrawl(msg) {
        var _a;
        const seneca = this;
        let homedir = '../../resource/handbook/';
        // const res = await fg.glob('**/*.md', { cwd: homedir })
        const res = await fast_glob_1.default.glob('*.md', { cwd: homedir, stats: true });
        for (let i = 0; i < res.length; i++) {
            let docmeta = await seneca
                .entity(options.meta)
                .data$({
                kind: 'file',
                name: res[i].name,
                path: res[i].path,
                relpath: homedir + res[i].path,
                size: (_a = res[i].stats) === null || _a === void 0 ? void 0 : _a.size,
            })
                .save$();
        }
        let pages = await seneca.entity(options.meta).list$();
        console.log('pages:', pages);
    }
}
const defaults = {
    debug: false,
    meta: 'doc/meta',
    body: 'doc/body',
};
Object.assign(FileSpider, { defaults });
exports.default = FileSpider;
if ('undefined' !== typeof module) {
    module.exports = FileSpider;
}
//# sourceMappingURL=FileSpider.js.map