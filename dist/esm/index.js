var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
					});
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator['throw'](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
			}
			step((generator = generator.apply(thisArg, _arguments || [])).next());
		});
	};
import { parseString } from 'xml2js';
import { EpisodeType } from './types.js';
export * from './types.js';
export const ERRORS = {
	requiredError: new Error('One or more required values are missing from feed.'),
	optionsError: new Error('Invalid options.')
};
const NS = {
	itunesAuthor: 'itunes:author',
	itunesBlock: 'itunes:block',
	itunesCategory: 'itunes:category',
	itunesComplete: 'itunes:complete',
	itunesDuration: 'itunes:duration',
	itunesEmail: 'itunes:email',
	itunesExplicit: 'itunes:explicit',
	itunesImage: 'itunes:image',
	itunesKeywords: 'itunes:keywords',
	itunesName: 'itunes:name',
	itunesOrder: 'itunes:order',
	itunesOwner: 'itunes:owner',
	itunesSubtitle: 'itunes:subtitle',
	itunesSummary: 'itunes:summary',
	itunesType: 'itunes:type',
	itunesEpisodeType: 'itunes:episodeType',
	itunesSeason: 'itunes:season',
	podcastChapters: 'podcast:chapters',
	podcastFunding: 'podcast:funding',
	podcastLocked: 'podcast:locked',
	podcastSoundbite: 'podcast:soundbite',
	podcastTranscript: 'podcast:transcript',
	podcastValue: 'podcast:value',
	podcastValueRecipient: 'podcast:valueRecipient'
};
const fieldsMeta = [
	'author',
	'blocked',
	'categories',
	'complete',
	'copyright',
	'description',
	'docs',
	'editor',
	'explicit',
	'funding',
	'generator',
	'guid',
	'imageURL',
	'keywords',
	'language',
	'lastBuildDate',
	'link',
	'locked',
	'pubDate',
	'owner',
	'subtitle',
	'summary',
	'title',
	'type',
	'value',
	'webMaster'
];
const fieldsEpisodes = [
	'author',
	'blocked',
	'chapters',
	'description',
	'duration',
	'enclosure',
	'episodeType',
	'explicit',
	'funding',
	'guid',
	'imageURL',
	'keywords',
	'language',
	'link',
	'order',
	'pubDate',
	'season',
	'soundbite',
	'subtitle',
	'summary',
	'title',
	'transcript',
	'value'
];
const requiredMeta = [];
const requiredEpisodes = [];
const uncleanedMeta = ['categories', 'funding', 'guid', 'value'];
const uncleanedEpisodes = ['funding', 'guid', 'soundbite', 'transcript', 'value'];
const DEFAULT = {
	fields: {
		meta: fieldsMeta,
		episodes: fieldsEpisodes
	},
	required: {
		meta: requiredMeta,
		episodes: requiredEpisodes
	},
	uncleaned: {
		meta: uncleanedMeta,
		episodes: uncleanedEpisodes
	}
};
function mergeDedupe(arr) {
	return [...new Set([].concat(...arr))];
}
const buildOptions = function (params) {
	try {
		let options = {
			fields: {
				meta: fieldsMeta,
				episodes: fieldsEpisodes
			},
			required: {
				meta: requiredMeta,
				episodes: requiredEpisodes
			},
			uncleaned: {
				meta: uncleanedMeta,
				episodes: uncleanedEpisodes
			}
		};
		if (typeof params === 'undefined') {
			options = DEFAULT;
			return options;
		}
		Object.keys(options).forEach((key) => {
			if (params[key] !== undefined) {
				Object.assign(options[key], params[key]);
			}
		});
		if (options.fields.meta.indexOf('default') >= 0) {
			options.fields.meta = mergeDedupe([DEFAULT.fields.meta, params.fields.meta]);
			options.fields.meta.splice(options.fields.meta.indexOf('default'), 1);
		}
		if (options.fields.episodes.indexOf('default') >= 0) {
			options.fields.episodes = mergeDedupe([DEFAULT.fields.episodes, params.fields.episodes]);
			options.fields.episodes.splice(options.fields.episodes.indexOf('default'), 1);
		}
		return options;
	} catch (err) {
		throw ERRORS.optionsError;
	}
};
const GET = {
	author: function (node) {
		if (node.author && node.author[0]) {
			return node.author[0];
		} else if (node[NS.itunesAuthor] && node[NS.itunesAuthor][0]) {
			return node[NS.itunesAuthor][0];
		}
	},
	blocked: function (node) {
		if (node[NS.itunesBlock] && node[NS.itunesBlock][0]) {
			return node[NS.itunesBlock][0];
		}
	},
	categories: function (node) {
		const itunesCategories = node['itunes:category'];
		if (Array.isArray(itunesCategories)) {
			const categoriesArray = itunesCategories
				.map((item) => {
					let category;
					if (item && item['$'] && item['$'].text) {
						category = { name: item['$'].text };
						if (item[NS.itunesCategory]) {
							category.subCatergory = { name: item[NS.itunesCategory][0]['$'].text };
						}
					}
					return category;
				})
				.filter((category) => category !== undefined);
			return categoriesArray;
		}
		return [];
	},
	chapters: function (node) {
		const items = getItemsWithAttrs(node[NS.podcastChapters]);
		if (items && items[0]) {
			return {
				type: items[0].attrs.type,
				url: items[0].attrs.url
			};
		}
	},
	complete: function (node) {
		return node[NS.itunesComplete];
	},
	duration: function (node) {
		return node[NS.itunesDuration];
	},
	editor: function (node) {
		return node.managingEditor;
	},
	episodeType: function (node) {
		if (node[NS.itunesEpisodeType] !== undefined && node[NS.itunesEpisodeType][0] !== undefined) {
			return node[NS.itunesEpisodeType][0];
		}
	},
	explicit: function (node) {
		return node[NS.itunesExplicit];
	},
	funding: function (node) {
		const items = getItemsWithAttrs(node[NS.podcastFunding]);
		const finalItems = [];
		for (const item of items) {
			finalItems.push({
				value: item.value,
				url: item.attrs.url
			});
		}
		return finalItems;
	},
	guid: function (node) {
		if (node.guid) {
			if (typeof node.guid === 'string') {
				return node.guid;
			} else if (Array.isArray(node.guid) && node.guid[0] && node.guid[0]._) {
				return node.guid[0]._;
			}
		}
	},
	imageURL: function (node) {
		if (
			node['itunes:image'] &&
			node['itunes:image'][0] &&
			node['itunes:image'][0]['$'] &&
			node['itunes:image'][0]['$'].href
		) {
			return node['itunes:image'][0]['$'].href;
		}
		if (typeof node['itunes:image'] === 'string') {
			return node['itunes:image'];
		}
		if (node.image && node.image[0] && node.image[0].url[0]) {
			return node.image[0].url[0];
		}
		return undefined;
	},
	keywords: function (node) {
		return node[NS.itunesKeywords];
	},
	locked: function (node) {
		const items = getItemsWithAttrs(node[NS.podcastLocked]);
		if (items[0]) {
			return {
				value: items[0].value,
				owner: items[0].attrs.owner
			};
		}
	},
	order: function (node) {
		return node[NS.itunesOrder];
	},
	owner: function (node) {
		return node[NS.itunesOwner];
	},
	season: function (node) {
		return node[NS.itunesSeason];
	},
	soundbite: function (node) {
		const items = getItemsWithAttrs(node[NS.podcastSoundbite]);
		const finalItems = [];
		for (const item of items) {
			const duration = parseFloat(item.attrs.duration);
			const startTime = parseFloat(item.attrs.startTime);
			if (!duration) continue;
			if (!startTime && startTime !== 0) continue;
			finalItems.push({
				duration,
				startTime,
				title: item.value
			});
		}
		return finalItems;
	},
	subtitle: function (node) {
		return node[NS.itunesSubtitle];
	},
	summary: function (node) {
		return node[NS.itunesSummary];
	},
	transcript: function (node) {
		const items = getItemsWithAttrs(node[NS.podcastTranscript]);
		const finalItems = [];
		if (Array.isArray(items)) {
			for (const item of items) {
				const { language, rel, type, url } = item.attrs;
				finalItems.push({
					language,
					rel,
					type,
					url
				});
			}
		}
		return finalItems;
	},
	type: function (node) {
		return node[NS.itunesType];
	},
	value: function (node) {
		const valueItems = getItemsWithAttrs(node[NS.podcastValue], [NS.podcastValueRecipient]);
		let finalValues = null;
		if (valueItems && valueItems.length > 0) {
			finalValues = [];
			for (const valueItem of valueItems) {
				const { method, suggested, type } = valueItem.attrs;
				let finalValue = { method, suggested, type };
				const valueRecipientItems =
					valueItem.nestedTags && valueItem.nestedTags[NS.podcastValueRecipient];
				if (Array.isArray(valueRecipientItems)) {
					const finalRecipients = [];
					for (const valueRecipientItem of valueRecipientItems) {
						const { address, customKey, customValue, fee, name, split, type } =
							valueRecipientItem.attrs;
						finalRecipients.push({
							address,
							customKey,
							customValue,
							fee,
							name,
							split,
							type
						});
					}
					finalValue.recipients = finalRecipients;
					finalValues.push(finalValue);
				}
			}
		}
		return finalValues;
	}
};
const getDefault = function (node, field) {
	return node[field] ? node[field] : undefined;
};
const CLEAN = {
	blocked: function (string) {
		if (string.toLowerCase() == 'yes') {
			return true;
		} else {
			return false;
		}
	},
	complete: function (string) {
		if (string[0].toLowerCase() == 'yes') {
			return true;
		}
		return false;
	},
	duration: function (arr) {
		let times = arr[0].split(':'),
			sum = 0,
			mul = 1;
		while (times.length > 0) {
			sum += mul * parseInt(times.pop());
			mul *= 60;
		}
		return sum;
	},
	enclosure: function (object) {
		return {
			length: object[0]['$'].length,
			type: object[0]['$'].type,
			url: object[0]['$'].url
		};
	},
	episodeType: function (string) {
		if (string.length > 0) {
			switch (string.charAt(0).toUpperCase()) {
				case 'F':
					return EpisodeType.FULL;
				case 'T':
					return EpisodeType.TRAILER;
				case 'B':
					return EpisodeType.BONUS;
			}
		}
		return undefined;
	},
	explicit: function (string) {
		if (['yes', 'explicit', 'true'].indexOf(string[0].toLowerCase()) >= 0) {
			return true;
		} else if (['clean', 'no', 'false'].indexOf(string[0].toLowerCase()) >= 0) {
			return false;
		} else {
			return undefined;
		}
	},
	imageURL: function (string) {
		return string;
	},
	owner: function (object) {
		let ownerObject = {};
		if (object[0].hasOwnProperty(NS.itunesName)) {
			ownerObject.name = object[0][NS.itunesName][0];
		}
		if (object[0].hasOwnProperty(NS.itunesEmail)) {
			ownerObject.email = object[0][NS.itunesEmail][0];
		}
		return ownerObject;
	},
	pubDate: function (dateString) {
		return new Date(dateString);
	},
	lastBuildDate: function (dateString) {
		return new Date(dateString);
	},
	season: function (numberString) {
		return Number.parseInt(numberString);
	}
};
const cleanDefault = function (node) {
	if (node !== undefined && Array.isArray(node) && node[0] !== undefined) {
		return node[0];
	} else {
		return node;
	}
};
const getInfo = function (node, field, uncleaned) {
	var info;
	info = GET[field] ? GET[field].call(this, node) : getDefault(node, field);
	if (!uncleaned && info !== undefined) {
		info = CLEAN[field] ? CLEAN[field].call(this, info) : cleanDefault(info);
	} else {
	}
	return info;
};
function createMetaObjectFromFeed(channel, options) {
	const meta = {};
	if (Array.isArray(options.fields.meta)) {
		options.fields.meta.forEach((field) => {
			const obj = {};
			var uncleaned = false;
			if (options.uncleaned && Array.isArray(options.uncleaned.meta)) {
				var uncleaned = options.uncleaned.meta.indexOf(field) >= 0;
			}
			obj[field] = getInfo(channel, field, uncleaned);
			Object.assign(meta, obj);
		});
	}
	if (options.required && Array.isArray(options.required.meta)) {
		options.required.meta.forEach((field) => {
			if (Object.keys(meta).indexOf(field) < 0) {
				throw ERRORS.requiredError;
			}
		});
	}
	return meta;
}
function createEpisodesObjectFromFeed(channel, options) {
	let episodes = [];
	if (channel && Array.isArray(channel.item)) {
		channel.item.forEach((item) => {
			const episode = {};
			if (options.fields && Array.isArray(options.fields.episodes)) {
				options.fields.episodes.forEach((field) => {
					const obj = {};
					var uncleaned = false;
					if (options.uncleaned && Array.isArray(options.uncleaned.episodes)) {
						var uncleaned = options.uncleaned.episodes.indexOf(field) >= 0;
					}
					obj[field] = getInfo(item, field, uncleaned);
					Object.assign(episode, obj);
				});
			}
			if (options.required && Array.isArray(options.required.episodes)) {
				options.required.episodes.forEach((field) => {
					if (Object.keys(episode).indexOf(field) < 0) {
						throw ERRORS.requiredError;
					}
				});
			}
			episodes.push(episode);
		});
	}
	episodes.sort(function (a, b) {
		if (a.order == b.order) {
			if (a.pubDate == b.pubDate) {
				if (a.title == b.title) return 1;
				if (a.title !== undefined && b.title === undefined) {
					return 1;
				}
				if (b.title !== undefined && a.title === undefined) {
					return -1;
				}
				return a.title > b.title ? -1 : 1;
			}
			if (a.pubDate !== undefined && b.pubDate === undefined) {
				return 1;
			}
			if (b.pubDate !== undefined && a.pubDate === undefined) {
				return -1;
			}
			return b.pubDate > a.pubDate ? 1 : -1;
		}
		if (a.order !== undefined && b.order === undefined) {
			return 1;
		}
		if (b.order !== undefined && a.order === undefined) {
			return -1;
		}
		return a.order > b.order ? -1 : 1;
	});
	return episodes;
}
function promiseParseXMLFeed(feedText) {
	return new Promise((resolve, reject) => {
		parseString(feedText, (error, result) => {
			if (error) {
				reject(error);
			}
			resolve(result);
		});
	});
}
function parseXMLFeed(feedText) {
	let feed = {};
	parseString(feedText, (error, result) => {
		if (error) {
			throw error;
		}
		Object.assign(feed, result);
		return result;
	});
	return feed;
}
function fetchFeed(requestParams) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const { headers, timeout = 20000 } = requestParams;
			const abortController = new AbortController();
			const signal = abortController.signal;
			setTimeout(() => {
				abortController.abort();
			}, timeout);
			const feedResponse = yield fetch(requestParams.url, { headers, signal });
			if (feedResponse.status === 401) {
				throw new Error('401');
			}
			const feedText = yield feedResponse.text();
			const feedObject = yield promiseParseXMLFeed(feedText);
			return feedObject;
		} catch (err) {
			throw err;
		}
	});
}
export const getPodcastFromURL = function (requestParams, buildParams) {
	return __awaiter(this, void 0, void 0, function* () {
		try {
			const options = buildOptions(buildParams);
			const feedResponse = yield fetchFeed(requestParams);
			const channel = feedResponse.rss.channel[0];
			const meta = createMetaObjectFromFeed(channel, options);
			const episodes = createEpisodesObjectFromFeed(channel, options);
			return { meta, episodes };
		} catch (err) {
			throw err;
		}
	});
};
export const getPodcastFromFeed = function (feed, params) {
	try {
		const options = buildOptions(params);
		const feedObject = parseXMLFeed(feed);
		const channel = feedObject.rss.channel[0];
		const meta = createMetaObjectFromFeed(channel, options);
		const episodes = createEpisodesObjectFromFeed(channel, options);
		return { meta, episodes };
	} catch (err) {
		throw err;
	}
};
const getItemsWithAttrs = (val, nestedTags = []) => {
	if (Array.isArray(val)) {
		const items = [];
		for (const item of val) {
			if (typeof item === 'string') {
				items.push({
					value: item,
					attrs: {}
				});
			} else if (item) {
				const finalTags = {};
				if (nestedTags && nestedTags.length > 0) {
					for (const nestedTag of nestedTags) {
						const nestedItem = getItemsWithAttrs(item[nestedTag]);
						finalTags[nestedTag] = nestedItem;
					}
				}
				items.push(
					Object.assign(
						{ value: item._, attrs: item['$'] ? item['$'] : {} },
						Object.keys(finalTags).length > 0 ? { nestedTags: finalTags } : {}
					)
				);
			}
		}
		return items;
	}
	return [];
};
const convertCommaDelimitedStringToArray = (str) => {
	str = str.replace(/(\r\n|\n|\r)/gm, '');
	let strs = str.split(',');
	return strs;
};
