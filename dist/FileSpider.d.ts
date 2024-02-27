type FilespiderOptions = {
    debug?: boolean;
    MetaEnt: string;
    BodyEnt: string;
};
declare function FileSpider(this: any, options: FilespiderOptions): void;
export default FileSpider;
