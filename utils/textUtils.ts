/**
 * Function to capitalize the first letter of a string
 * @param text
 * @returns string
 */
export function maj(text: string) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Function to reduce the length of a string
 * @param text
 * @param maxLength
 * @returns string
 */
export function reduceText(text: string, maxLength: number) {
	if (text.length > maxLength) {
		return text.slice(0, maxLength) + "...";
	}
	return text;
}
