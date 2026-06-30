export function htmlBodyToText(html: string): string {
    html = html?.replace(/<!DOCTYPE[^>]*>/gi, '');
    html = html?.replace(/<\/?html[^>]*>/gi, '');
    // Remove all HTML tags and entities
    return html
        ?.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        ?.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        ?.replace(/<\/?\w+[^>]*>/gi, '')
        ?.replace(/&nbsp;|&#160;|&#xA0;/gi, ' ')
        ?.replace(/&[^;]+;/g, '')
        ?.replace(/\s+/g, ' ')
        ?.trim();
}
