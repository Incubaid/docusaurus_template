import { jsPDF } from 'jspdf';
import { marked, Token } from 'marked';
import * as fs from 'fs';

interface TableToken {
    type: 'table';
    header: string[];
    align: Array<'left' | 'center' | 'right' | null>;
    rows: string[][];
    raw: string;
    text: string;
    depth?: number;
}

function isTableToken(token: any): token is TableToken {
    return token.type === 'table' && 
           Array.isArray(token.header) &&
           Array.isArray(token.rows);
}
import { PDFStyles, TableCell, TableOptions, ImageOptions, HeaderLevel } from './types';
import { defaultStyles, getEffectiveWidth, getHeaderStyle } from './styles';

export class PDFGenerator {
    private doc: jsPDF;
    private currentY: number;
    private styles: PDFStyles;
    private effectiveWidth: number;

    constructor(styles: Partial<PDFStyles> = {}) {
        this.styles = { ...defaultStyles, ...styles };
        this.effectiveWidth = getEffectiveWidth(this.styles);
        this.doc = new jsPDF();
        this.currentY = this.styles.marginTop;
        
        // Load and add Inter fonts
        const interRegular = fs.readFileSync('static/fonts/Inter_28pt-Regular.ttf');
        const interMedium = fs.readFileSync('static/fonts/Inter_28pt-Medium.ttf');
        const interLight = fs.readFileSync('static/fonts/Inter_28pt-Light.ttf');
        
        this.doc.addFileToVFS('Inter-Regular.ttf', interRegular.toString('base64'));
        this.doc.addFileToVFS('Inter-Medium.ttf', interMedium.toString('base64'));
        this.doc.addFileToVFS('Inter-Light.ttf', interLight.toString('base64'));
        
        this.doc.addFont('Inter-Regular.ttf', 'InterRegular', 'normal');
        this.doc.addFont('Inter-Medium.ttf', 'InterMedium', 'normal');
        this.doc.addFont('Inter-Light.ttf', 'InterLight', 'normal');
    }

    private checkAndAddPage(): void {
        if (this.currentY > this.styles.pageHeight - this.styles.marginBottom) {
            this.doc.addPage();
            this.currentY = this.styles.marginTop;
        }
    }

    private renderFormattedText(text: string, startX: number, width: number): void {
        // Split text into parts based on bold and link markers
        const parts = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/);
        let xOffset = startX;
        const availableWidth = width || this.effectiveWidth;
        let currentLine = '';
        let currentLineWidth = 0;

        const flushLine = () => {
            if (currentLine.trim()) {
                this.checkAndAddPage();
                this.doc.text(currentLine.trim(), this.styles.marginLeft, this.currentY);
                this.currentY += this.styles.normal.fontSize * 0.35;
                currentLine = '';
                currentLineWidth = 0;
                xOffset = startX;
            }
        };

        parts.forEach(part => {
            if (part.startsWith('**') && part.endsWith('**')) {
                // Bold text
                const boldText = part.replace(/\*\*/g, '');
                this.doc.setFont(this.styles.bold.font, this.styles.bold.style);
                const textWidth = this.doc.getTextWidth(boldText);

                if (currentLineWidth + textWidth > availableWidth) {
                    flushLine();
                }

                currentLine += boldText;
                currentLineWidth += textWidth;
            } else if (part.match(/\[(.*?)\]\((.*?)\)/)) {
                // Link text
                const [, text, url] = part.match(/\[(.*?)\]\((.*?)\)/)!;
                this.doc.setFont(this.styles.normal.font, this.styles.normal.style);
                this.doc.setTextColor(0, 0, 255); // Blue color for links
                const textWidth = this.doc.getTextWidth(text);

                if (currentLineWidth + textWidth > availableWidth) {
                    flushLine();
                }

                // Store link position for adding after text is rendered
                const linkX = xOffset + currentLineWidth;
                const linkY = this.currentY;
                
                currentLine += text;
                currentLineWidth += textWidth;

                // Add link annotation
                this.doc.link(linkX, linkY - this.styles.normal.fontSize * 0.8, textWidth, this.styles.normal.fontSize, { url });
                this.doc.setTextColor(0); // Reset text color
            } else if (part.trim()) {
                // Normal text
                this.doc.setFont(this.styles.normal.font, this.styles.normal.style);
                const words = part.split(/\s+/);

                words.forEach(word => {
                    const wordWidth = this.doc.getTextWidth(word + ' ');
                    if (currentLineWidth + wordWidth > availableWidth) {
                        flushLine();
                    }
                    currentLine += (currentLine ? ' ' : '') + word;
                    currentLineWidth += wordWidth;
                });
            }
        });

        flushLine();
        this.currentY += this.styles.lineHeight;
    }

    private addText(text: string, style: { fontSize: number; font: string; style: string }): void {
        this.doc.setFont(style.font, style.style);
        this.doc.setFontSize(style.fontSize);
        this.renderFormattedText(text, this.styles.marginLeft, this.effectiveWidth);
    }

    add_pagebreak(): void {
        this.doc.addPage();
        this.currentY = this.styles.marginTop;
    }

    add_header(level: HeaderLevel, text: string): void {
        const style = getHeaderStyle(this.styles, level);
        this.addText(text, style);
    }

    add_text(text: string, bold: boolean = false): void {
        if (bold) {
            text = `**${text}**`;
        }
        this.renderFormattedText(text, this.styles.marginLeft, this.effectiveWidth);
    }

    add_table(data: TableCell[][], options: TableOptions = {}): void {
        const columnCount = Math.max(...data.map(row => row.length));
        const columnWidth = this.effectiveWidth / columnCount;
        const defaultWidths = Array(columnCount).fill(columnWidth);
        const widths = options.widths || defaultWidths;
        
        data.forEach((row, rowIndex) => {
            const maxHeight = Math.max(...row.map(cell => {
                const style = rowIndex === 0 && options.headers ? this.styles.table.header : this.styles.table.cell;
                this.doc.setFont(style.font, style.style);
                this.doc.setFontSize(style.fontSize);
                const lines = this.doc.splitTextToSize(cell.content, widths[0]);
                return lines.length * style.fontSize * 0.35;
            }));

            if (this.currentY + maxHeight > this.styles.pageHeight - this.styles.marginBottom) {
                this.add_pagebreak();
            }

            let x = this.styles.marginLeft;
            row.forEach((cell, colIndex) => {
                const style = rowIndex === 0 && options.headers ? this.styles.table.header : this.styles.table.cell;
                this.doc.setFont(style.font, style.style);
                this.doc.setFontSize(style.fontSize);

                this.doc.rect(x, this.currentY - this.styles.table.padding, widths[colIndex], maxHeight + this.styles.table.padding * 2);

                const lines = this.doc.splitTextToSize(cell.content, widths[colIndex] - this.styles.table.padding * 2);
                lines.forEach((line: string, lineIndex: number) => {
                    const textX = x + this.styles.table.padding;
                    const textY = this.currentY + lineIndex * style.fontSize * 0.35;
                    this.doc.text(line, textX, textY);
                });

                x += widths[colIndex];
            });

            this.currentY += maxHeight + this.styles.table.padding * 2;
        });

        this.currentY += this.styles.lineHeight;
    }

    add_image(imagePath: string, options: ImageOptions = {}): void {
        try {
            const ext = imagePath.split('.').pop()?.toLowerCase();
            if (!ext) {
                throw new Error('Image file must have an extension');
            }

            const imageData = fs.readFileSync(imagePath);
            let width = options.width || this.effectiveWidth;
            let height: number;

            if (ext === 'svg') {
                height = options.height || width * 0.6;
            } else {
                const imageProps = this.doc.getImageProperties(imageData);
                height = options.height || (width * imageProps.height / imageProps.width);

                if (height > getEffectiveWidth(this.styles)) {
                    height = getEffectiveWidth(this.styles);
                    width = height * imageProps.width / imageProps.height;
                }
            }

            if (this.currentY + height > this.styles.pageHeight - this.styles.marginBottom) {
                this.add_pagebreak();
            }

            let x = this.styles.marginLeft;
            if (options.align === 'center') {
                x += (this.effectiveWidth - width) / 2;
            } else if (options.align === 'right') {
                x += this.effectiveWidth - width;
            }

            if (ext === 'svg') {
                this.doc.addSvgAsImage(imageData.toString(), x, this.currentY, width, height);
            } else {
                this.doc.addImage(imageData, ext.toUpperCase(), x, this.currentY, width, height);
            }
            this.currentY += height;

            if (options.caption) {
                this.currentY += this.styles.lineHeight;
                this.add_text(options.caption);
            }

            this.currentY += this.styles.lineHeight;
        } catch (error) {
            console.error(`Error adding image: ${error.message}`);
        }
    }

    add_md(markdownPath: string): void {
        try {
            const markdown = fs.readFileSync(markdownPath, 'utf-8');
            const content = markdown.replace(/^---[\s\S]*?---/, '').trim();
            const tokens = marked.lexer(content);
            
            // Create a custom renderer to handle links
            const renderer = new marked.Renderer();
            renderer.link = (href, title, text) => {
                return `[${text}](${href})`;
            };
            marked.setOptions({ renderer });
            
            tokens.forEach(token => {
                switch (token.type) {
                    case 'heading':
                        this.add_header(Math.min(token.depth, 3) as HeaderLevel, token.text);
                        break;
                        
                    case 'paragraph':
                        this.renderFormattedText(token.text, this.styles.marginLeft, this.effectiveWidth);
                        break;
                        
                    case 'list':
                        token.items.forEach((item, index) => {
                            const bullet = token.ordered ? `${index + 1}.` : '•';
                            const text = item.text.replace(/^\s*\d+\.\s*|\s*•\s*/, '');
                            
                            this.doc.setFont(this.styles.normal.font, this.styles.normal.style);
                            this.doc.setFontSize(this.styles.normal.fontSize);
                            this.doc.text(bullet, this.styles.marginLeft, this.currentY);
                            
                            this.renderFormattedText(text, this.styles.marginLeft + this.styles.listMargin, 
                                this.effectiveWidth - this.styles.listMargin);
                        });
                        break;
                        
                    case 'table':
                        if (isTableToken(token)) {
                            const tableData = [
                                token.header.map(h => ({ content: h })),
                                ...token.rows.map(row => row.map(cell => ({ content: cell })))
                            ];
                            this.add_table(tableData, { headers: token.header });
                        }
                        break;
                        
                    case 'space':
                        this.currentY += this.styles.lineHeight;
                        break;
                }
            });
        } catch (error) {
            console.error(`Error processing markdown: ${error.message}`);
        }
    }

    save_pdf(outputPath: string): void {
        this.doc.save(outputPath);
    }
}
