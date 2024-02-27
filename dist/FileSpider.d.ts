type FileSpiderOptionsFull = {
    debug?: boolean;
    canon: {
        zone: string | undefined;
        base: string | undefined;
        name: string | undefined;
    };
    MetaEnt: string;
    BodyEnt: string;
};
export type FileSpiderOptions = Partial<FileSpiderOptionsFull>;
declare function FileSpider(this: any, options: FileSpiderOptionsFull): void;
export default FileSpider;
