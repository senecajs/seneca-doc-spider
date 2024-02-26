"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* Copyright © 2022 Seneca Project Contributors, MIT License. */
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function FileSpider(options) {
    const seneca = this;
    seneca
        .fix('sys:spider,spider:file')
        .message('start:crawl', msgStartCrawl);
    async function msgStartCrawl(msg) {
        const seneca = this;
        let homedir = '../../resource/handbook/';
        // const res = await fg.glob('**/*.md', { cwd: homedir })
        const res = await fast_glob_1.default.glob('*.md', { cwd: homedir });
        for (let i = 0; i < res.length; i++) {
            // Process metadata then save contents?
            // let readStream = fs.createReadStream(homedir + res[i], 'utf8')
            // let fileContents
            // readStream.on('data', function (chunk) {
            //   fileContents = chunk
            // })
            await seneca
                .entity(options.canon)
                .data$({
                file: path_1.default.basename(res[i]),
                path: res[i],
                relpath: homedir + res[i],
                content: fs_1.default.readFileSync(homedir + res[i], 'utf8'),
            })
                .save$();
        }
        let pages = await seneca.entity(options.canon).list$();
        console.log('pages:', pages);
    }
}
// Default options.
const defaults = {
    // TODO: Enable debug logging
    debug: false,
    canon: 'fsp/page',
};
Object.assign(FileSpider, { defaults });
exports.default = FileSpider;
if ('undefined' !== typeof module) {
    module.exports = FileSpider;
}
//# sourceMappingURL=FileSpider.js.map