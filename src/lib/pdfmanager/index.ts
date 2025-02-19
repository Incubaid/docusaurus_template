import { PDFGenerator } from './generator';
import { HTMLPDFGenerator } from './html-generator';
import { BookCreator } from './book-creator';
import { PDFStyles } from './types';
import { defaultStyles } from './styles';

/**
 * Create a new PDF Generator instance using the original jsPDF implementation
 * @param styles Optional custom styles to override defaults
 * @returns PDFGenerator instance
 */
export function createPDFGenerator(styles: Partial<PDFStyles> = {}): PDFGenerator {
    return new PDFGenerator(styles);
}

/**
 * Create a new PDF Generator instance using HTML/CSS-based implementation
 * This version provides better markdown support through proper HTML rendering
 * @param styles Optional custom styles to override defaults
 * @returns HTMLPDFGenerator instance
 */
export function createHTMLPDFGenerator(styles: Partial<PDFStyles> = {}): HTMLPDFGenerator {
    return new HTMLPDFGenerator(styles);
}

export type { PDFStyles, TableCell, TableOptions, ImageOptions, HeaderLevel } from './types';
/**
 * Create a new Book Creator instance for generating PDFs from markdown directories
 * @returns BookCreator instance
 */
export function createBookCreator(): BookCreator {
    return new BookCreator();
}

export { defaultStyles };
export { BookCreator };
