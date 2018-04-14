const sanitize = require('sanitize-filename');

export default function sanitizeName(name: string): string {
    return sanitize(name);
}