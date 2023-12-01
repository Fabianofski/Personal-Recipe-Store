import { database, verifyIdToken } from '$lib/firebase.admin';

export async function POST({ request, url }) {
	const token = request.headers.get('Authorization');

	try {
		const uid = await verifyIdToken(token);
		const collectionName = url.searchParams.get('collectionName');
		if (!collectionName) return new Response('400 Bad Request', { status: 400 });
		let illegalCharacters = ['.', '#', '$', '[', ']'];
		for (let char in illegalCharacters) {
			if (collectionName.includes(char)) {
				return new Response(
					'400 Bad Request. ' + illegalCharacters.join(' ,' + ' are not allowed.'),
					{ status: 400 }
				);
			}
		}

		try {
			const ref = database.ref(`users/${uid}/collections`);
			const snapshot = await ref.get();
			const collections = (snapshot.val() as string[]) || [];

			if (collections.includes(collectionName)) return new Response('');
			collections.push(collectionName);

			await ref.set(collections);
			return new Response('200 Ok', { status: 200 });
		} catch (err) {
			console.error(err);
			return new Response('500 Internal Server Error', { status: 500 });
		}
	} catch {
		return new Response('401 Unauthorized', { status: 401 });
	}
}
