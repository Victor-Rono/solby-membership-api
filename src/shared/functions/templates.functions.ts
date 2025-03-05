/* eslint-disable prettier/prettier */
/**
 * Extracts the content of the <body> section from an HTML string.
 * If no <body> is found, returns the entire string.
 * @param html The HTML string.
 * @returns The content inside the <body> tag.
 */
export function extractBodyContent(html: string): string {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    return bodyMatch && bodyMatch[1] ? bodyMatch[1].trim() : html;
}

/**
 * Combines multiple HTML strings (each containing their own inline styles)
 * into a single HTML document with inline styling.
 *
 * Each HTML string's body content is wrapped in a div with an inline style
 * that forces a page break after it.
 *
 * @param htmlStrings An array of HTML strings.
 * @returns The combined HTML document as a string.
 */
export function combineHtmlTextsInline(htmlStrings: string[]): string {
    let combinedBody = '';

    htmlStrings.forEach((html, index) => {
        const bodyContent = extractBodyContent(html);
        // Wrap each HTML's body content with a div that forces a page break.
        combinedBody += `<div style="page-break-after: always;">\n<!-- Content from HTML #${index + 1} -->\n${bodyContent}\n</div>\n`;
    });

    // Build the final combined HTML document.
    // All styling is done inline. The <body> has inline styles for background and padding.
    const finalHtml = `
    <div style="background-color: #ffffff; font-family: Arial, sans-serif; margin: 0; padding: 10px;">
      ${combinedBody}
    </div>
  </html>
    `;
    return finalHtml;
}