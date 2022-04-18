export function arrayExclude<T>(arr: T[], exclude: T) {
	return arr.filter(v => v != exclude);
}
export function arrayUnion<T>(arr1: T[], arr2: T[]) {
	return [...new Set([...arr1, ...arr2])];
}
export function arrayIntersection<T>(arr1: T[], arr2: T[]) {
	const set1 = new Set(arr1);
	const set2 = new Set(arr2);
	return [...set1].filter(v => set2.has(v));
}
export function arrayChanged<T>(arr1: T[], arr2: T[]) {
	return arr1.length !== arr2.length || !arr1.every(e => arr2.includes(e));
}
