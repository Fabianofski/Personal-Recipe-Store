export const prerender = false;

export function load({ params }) {
	return {
		collectionId: params.collectionId,
		id: params.id
	};
}
