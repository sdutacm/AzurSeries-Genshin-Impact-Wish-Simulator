import path from 'path';
// import adapter from '@sveltejs/adapter-vercel';
import adapter from '@sveltejs/adapter-cloudflare';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		appDir: 'internal',
		// adapter: adapter(),
		adapter: adapter({
			// See https://kit.svelte.dev/docs/adapter-cloudflare
		}),
		alias: {
			$post: path.resolve('./src/post')
		}
	},
	preprocess: preprocess({ postcss: true })
};

export default config;
