import { json, error } from '@sveltejs/kit';
import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { letter, word, font, bg, fg } = await request.json();

	const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

	try {
		const message = await client.messages.create({
			model: 'claude-sonnet-4-5',
			max_tokens: 1024,
			system:
				'You are a typographic layout engine for a premium print poster brand. ' +
				'The brand aesthetic is informed by 12 curated reference posters: ' +
				'considered whitespace, confident letter placement, editorial restraint, ' +
				'and occasional structural decoration (rules, borders, grids). ' +
				'Never produce cluttered or symmetrically boring layouts. ' +
				'Always return valid JSON only — no prose, no markdown fences.',
			messages: [
				{
					role: 'user',
					content:
						`Generate exactly 3 distinct poster layout options for a letter poster.\n` +
						`Letter: ${letter}, Word: ${word}, Font: ${font}, Background: ${bg}, Foreground: ${fg}.\n` +
						`Each layout must feel different in composition — e.g. centred, offset, anchored.\n` +
						`Return a JSON array of 3 objects. Each object must have:\n` +
						`  id (string), label ('Option A'/'Option B'/'Option C'),\n` +
						`  letterX (0–1), letterY (0–1), letterScale (0.5–0.85),\n` +
						`  wordX (0–1), wordY (0–1), wordScale (0.06–0.11),\n` +
						`  rotation (-8 to 8), anchor ('center'|'left'),\n` +
						`  decorativeElement ('none'|'rule-bottom'|'rule-full'|'double-border'|'grid-lines'|'diagonal')`
				}
			]
		});

		const content = message.content[0];
		if (content.type !== 'text') {
			throw new Error('Unexpected response type from Anthropic');
		}

		const layouts = JSON.parse(content.text);
		return json(layouts);
	} catch (err) {
		console.error('Layout generation error:', err);
		throw error(500, `Failed to generate layouts: ${err instanceof Error ? err.message : String(err)}`);
	}
};
