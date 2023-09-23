export type Episode = Partial<{
    author: string;
    blocked: boolean;
    chapters: string;
    description: string;
    duration: number;
    enclosure: Enclosure;
    explicit: boolean;
    funding: Funding[];
    guid: string;
    imageURL: string;
    keywords: any;
    language: string;
    link: string;
    order: number;
    pubDate: Date;
    soundbite: any[];
    subtitle: string;
    summary: string;
    title: string;
    transcript: Transcript[];
    value: Value[];
}>;
export type ValueRecipient = {
    name: string;
    type: string;
    address: string;
    customKey?: any;
    customValue?: any;
    split: number;
    fee?: boolean;
};
export type Value = {
    type: string;
    method: string;
    suggested: number;
    recipients?: ValueRecipient[];
};
export type Transcript = {
    language: string;
    rel: string;
    type: string;
    url: string;
};
export type Funding = {
    value: any;
    url: string;
};
export type Enclosure = {
    length: string;
    type: string;
    url: string;
};
export type Meta = Partial<{
    author: string;
    blocked: boolean;
    categories: string[];
    complete: boolean;
    description: string;
    docs: string;
    editor: string;
    explicit: boolean;
    funding: Funding[];
    generator: string;
    guid: string;
    imageURL: string;
    keywords: any;
    language: string;
    lastBuildDate: Date;
    owner: Owner;
    subtitle: string;
    summary: string;
    title: string;
    type: PodcastType;
    value: Value[];
    webMaster: string;
}>;
export type Feed = {
    meta: Meta;
    episodes: Episode[];
};
export type Owner = Partial<{
    name: string;
    email: string;
}>;
export declare enum PodcastType {
    SERIAL = "serial",
    EPISODIC = "episodic"
}
export type Item = {
    value: any;
    attrs: any;
    nestedTags?: Record<string, Item[]>;
};
