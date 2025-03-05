/* eslint-disable prettier/prettier */
/**
 * Counts the number of words in the given string.
 *
 * @param string - The string to count words in.
 * @returns The number of words in the string.
 */
export function WordCount(string: string): number {
    const numberOfWords: number = string.split(' ').length;
    return numberOfWords;
}

/**
 * Gets the first N words from a given string.
 *
 * @param numberOfWords - The number of words to return from the start of the string.
 * @param inputString - The string to get the words from.
 * @returns A string containing the first N words.
 * @throws Error if numberOfWords or inputString are not provided.
 */
export function getFirstWords(numberOfWords: number, inputString: string): string {
    if (numberOfWords <= 0 || !inputString.trim()) {
        throw new Error(`"numberOfWords" and "inputString" are required and must be valid`);
    }

    const wordsArray: string[] = inputString.split(' ');
    const firstWords: string[] = wordsArray.slice(0, numberOfWords);
    return firstWords.join(' ');
}

/**
 * Gets the last X words from a given range of words in a string.
 *
 * @param startIndex - The index to start extracting words from.
 * @param endIndex - The index to end extracting words at (inclusive).
 * @param inputString - The string to get the words from.
 * @returns A string containing the last X words within the specified range.
 * @throws Error if startIndex or endIndex are out of range, or if inputString is not provided.
 */
export function getLastWordsInRange(startIndex: number, endIndex: number, inputString: string): string {
    if (startIndex < 0 || endIndex < 0 || startIndex > endIndex || !inputString.trim()) {
        throw new Error(`"startIndex", "endIndex", and "inputString" are required and must be valid`);
    }

    const wordsArray: string[] = inputString.split(' ');
    const rangeWords: string[] = wordsArray.slice(startIndex, endIndex + 1);
    return rangeWords.join(' ');
}

/**
 * Converts the given string to camel case.
 *
 * @param stringToConvert - The string to convert to camel case.
 * @returns The string in camel case format.
 */
export function convertToCamelCase(value: string): string {
    const stringToConvert = value.trim()
    // Split the string into words based on spaces or other separators
    const words = stringToConvert.split(/[\s-_]+/);

    // Capitalize the first letter of each word after the first word
    const camelCaseWords = words.map((word, index) => {
        if (index === 0) {
            return word.toLowerCase(); // First word remains unchanged
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    });

    // Concatenate the words together without spaces or separators
    return camelCaseWords.join('');
}


/**
 * Capitalizes the first letter of each word in the given string.
 *
 * @param value - The input string to capitalize.
 * @returns The input string with the first letter of each word capitalized.
 */
export function capitalizeAllWords(value: string): string {
    const words = value.split(/\s+/); // Split the string into words based on spaces
    const capitalizedWords = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return capitalizedWords.join(' ');
}


/**
 * Shortens a given string to a maximum length, appending an ellipsis if the string is longer than the maximum length.
 *
 * @param inputString - The input string to be shortened.
 * @param maxLength - The maximum length of the output string.
 * @returns The shortened string, or the original string if it is already shorter than the maximum length.
 */
export function shortenString(inputString: string, maxLength: number) {
    if (inputString.length <= maxLength) {
        return inputString;
    }

    const shortened = inputString.slice(0, maxLength - 3) + '...';
    return shortened;
}
