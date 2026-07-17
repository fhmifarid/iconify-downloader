import { describe, it, expect, vi } from 'vitest';
import { 
    sanitizeFolderName, 
    sanitizeZipName, 
    withColorCustomization, 
    parseSvgForJson 
} from '../services/iconService';

describe('iconService Helpers', () => {
    describe('sanitizeFolderName', () => {
        it('should replace invalid characters with dashes', () => {
            expect(sanitizeFolderName('my<folder>')).toBe('my-folder-');
            expect(sanitizeFolderName('invalid/name\\here:?*|')).toBe('invalid-name-here----');
        });

        it('should trim whitespace', () => {
            expect(sanitizeFolderName('  hello  ')).toBe('hello');
        });
    });

    describe('sanitizeZipName', () => {
        it('should remove invalid characters and .zip extension', () => {
            expect(sanitizeZipName('archive?.zip')).toBe('archive-');
            expect(sanitizeZipName('My Archive.ZIP')).toBe('My Archive');
        });

        it('should default to "icons" if empty', () => {
            expect(sanitizeZipName('   ')).toBe('icons');
            expect(sanitizeZipName('.zip')).toBe('icons');
        });
    });

    describe('withColorCustomization', () => {
        const sampleSvg = `<svg viewBox="0 0 24 24"><path fill="red" stroke="blue" d="M1 1"/></svg>`;

        it('should apply color to the svg style', () => {
            const result = withColorCustomization(sampleSvg, '#000000', false);
            expect(result).toContain('color: #000000;');
        });

        it('should replace fill and stroke with currentColor if forceMonochrome is true', () => {
            const result = withColorCustomization(sampleSvg, '#ff0000', true);
            expect(result).toContain('fill="currentColor"');
            expect(result).toContain('stroke="currentColor"');
            expect(result).not.toContain('fill="red"');
            expect(result).not.toContain('stroke="blue"');
        });
    });

    describe('parseSvgForJson', () => {
        it('should parse svg properly and extract viewBox dimensions', () => {
            const svg = `<svg viewBox="0 0 48 48"><path d="M1 1"/></svg>`;
            const parsed = parseSvgForJson(svg, 'prefix:name');
            
            expect(parsed.prefix).toBe('prefix');
            expect(parsed.name).toBe('name');
            expect(parsed.width).toBe(48);
            expect(parsed.height).toBe(48);
            expect(parsed.body).toContain('<path d="M1 1"></path>'); // node-html-parser normalizes this
        });

        it('should throw an error if no svg element is found', () => {
            expect(() => parseSvgForJson('<div>Not an svg</div>', 'test:icon')).toThrow('Invalid SVG structure');
        });
    });
});
