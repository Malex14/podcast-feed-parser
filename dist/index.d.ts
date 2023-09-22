import { Feed } from './types';
export declare const ERRORS: {
    requiredError: Error;
    optionsError: Error;
};
export declare const getPodcastFromURL: (requestParams: {
    url: string;
    headers?: any;
    timeout?: any;
}, buildParams: any) => Promise<Feed>;
export declare const getPodcastFromFeed: (feed: string, params: any) => Feed;
