const path = require('path');
const fs = require('fs');
const charMap = require('./char-inner-name-to-id.json');

const outputSpUpPath = path.join(__dirname, '../src/lib/data/sp-up.json');
const outputBannerDir = path.join(__dirname, '../src/lib/data/banners/events/');
const EVENT_MAIN_NUMBER = '999';

/**
 * input data structure
 * {
 *   "userId": number;
 *   "nickname": string;
 *   "school": string;
 *   "genshinXpCharacter": string | 'none';
 *   "genshinUid": string;
 * }[]
 */

function main() {
	const args = process.argv.slice(2);
	const inputs = args;
	if (inputs.length < 1) {
		console.log('Usage: node convert-sdutoj-user-to-banner.js [input ...]');
		process.exit(1);
	}
	const banners = [];
	const spUpObj = {
		banner: {}
	};
	for (let i = 0; i < inputs.length; ++i) {
		const usersJson = JSON.parse(fs.readFileSync(inputs[i], 'utf-8'));
		const users = usersJson.filter((user) => {
			const valid = user.genshinXpCharacter && charMap[user.genshinXpCharacter];
			if (!valid) {
				console.warn('Ignored invalid user due to unknown XP character:', user);
			}
			return valid;
		});
		// convert banner
		const featured = users.map((user) => ({
			bannerName: `spup-${user.userId}-1`,
			character: charMap[user.genshinXpCharacter],
			textOffset: { l: 68, b: 10 }
		}));
		const bannerObj = {
			patch: Number(`${EVENT_MAIN_NUMBER}.${i + 1}`),
			data: [
				{
					phase: 1,
					banners: {
						standardVersion: 4,
						events: {
							featured,
							rateup: []
						},
						weapons: {
							bannerName: '',
							fatepointsystem: true,
							featured: [],
							rateup: [],
							textOffset: {
								featured: { l: 47, t: 68, w: 28 },
								rateup: { l: 77, b: 23 }
							}
						}
					}
				}
			]
		};
		banners.push(bannerObj);

		users.forEach((user) => {
			spUpObj.banner[`spup-${user.userId}`] = user.nickname; // 卡池名称
		});
	}

	console.log('Writing', outputSpUpPath);
	fs.writeFileSync(outputSpUpPath, JSON.stringify(spUpObj, null, 2));
	banners.forEach((banner) => {
		const bannerPath = path.join(outputBannerDir, banner.patch + '.json');
		console.log('Writing', bannerPath);
		fs.writeFileSync(bannerPath, JSON.stringify(banner, null, 2));
	});
}

main();

