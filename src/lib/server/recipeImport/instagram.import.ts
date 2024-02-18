import axios from 'axios';
import type { Recipe } from '../../../models/Recipe';
import * as cheerio from 'cheerio';

export async function extractInstagramRecipe(url: string): Promise<Recipe> {
	const response = await axios.get(url);
	const $ = cheerio.load(response.data);

	const date = extractDateFromText($('meta[property="og:description"]').attr('content') || '');

	const recipe: Recipe = {
		image: $('meta[property="og:image"]').attr('content') || '',
		title: extractTitleFromText($('title').text()).slice(0, 40),
		url: url,
		createdTime: date?.toUTCString() || '',
		updatedTime: date?.toUTCString() || '',
		difficulty: 'easy',
		ingredients: {},
		description: [],
		id: '',
		collectionId: '',
		creatorId: '',
		cookingTime: 20,
		numberOfServings: 4,
		tags: []
	};

	return recipe;
}

function extractTitleFromText(text: string): string {
	const startIndex = text.indexOf('on Instagram: "');
	if (startIndex !== -1) {
		return text.slice(startIndex + 15);
	} else {
		return text;
	}
}

function extractDateFromText(text: string): Date | null {
	const words = text.split(' ');

	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	let month, day, year;
	for (let i = 0; i < words.length; i++) {
		if (months.includes(words[i])) {
			month = words[i];
			day = parseInt(words[i + 1].replace(',', ''));
			year = parseInt(words[i + 2]);
			break;
		}
	}

	if (month && day && year) {
		const date = new Date(`${month} ${day}, ${year}`);
		return date;
	} else {
		return null;
	}
}
