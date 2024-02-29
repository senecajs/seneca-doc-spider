type FileSpiderOptionsFull = {
    debug?: boolean;
    metaCanon: {
        zone: string | undefined;
        base: string | undefined;
        name: string | undefined;
    };
    bodyCanon: {
        zone: string | undefined;
        base: string | undefined;
        name: string | undefined;
    };
};
export type FileSpiderOptions = Partial<FileSpiderOptionsFull>;
declare function FileSpider(this: any, options: FileSpiderOptionsFull): void;
export default FileSpider;
