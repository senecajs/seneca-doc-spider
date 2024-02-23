type ReferOptions = {
    debug?: boolean;
    token: {
        len?: number;
        alphabet?: string;
    };
    code: {
        len?: number;
        alphabet?: string;
    };
};
declare function filespider(this: any, options: ReferOptions): {
    exports: {
        genToken: any;
        genCode: any;
    };
};
export default filespider;
