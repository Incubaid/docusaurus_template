import { marked } from 'marked';
import * as fs from 'fs';
import * as htmlPdf from 'html-pdf-node';
import matter from 'gray-matter';
import { PDFStyles } from './types';
import { defaultStyles } from './styles';

export class HTMLPDFGenerator {
    private content: string = '';
    private styles: PDFStyles;

    constructor(styles: Partial<PDFStyles> = {}) {
        this.styles = { ...defaultStyles, ...styles };
    }

    private getDefaultCSS(): string {
        // Read base CSS template
        let css = fs.readFileSync('src/lib/pdfmanager/book.css', 'utf-8');
        
        // Read fonts
        const fontRegular = fs.readFileSync('static/fonts/Inter_28pt-Regular.ttf', 'base64');
        const fontMedium = fs.readFileSync('static/fonts/Inter_28pt-Medium.ttf', 'base64');
        const fontLight = fs.readFileSync('static/fonts/Inter_28pt-Light.ttf', 'base64');

        // Replace placeholders with actual values
        const replacements = {
            '__FONT_REGULAR__': fontRegular,
            '__FONT_MEDIUM__': fontMedium,
            '__FONT_LIGHT__': fontLight,
            '__FONT_SIZE_NORMAL__': this.styles.normal.fontSize,
            '__MARGIN_TOP__': this.styles.marginTop,
            '__MARGIN_RIGHT__': this.styles.marginRight,
            '__MARGIN_BOTTOM__': this.styles.marginBottom,
            '__MARGIN_LEFT__': this.styles.marginLeft,
            '__LIST_MARGIN__': this.styles.listMargin,
            '__H1_SIZE__': this.styles.h1.fontSize,
            '__H2_SIZE__': this.styles.h2.fontSize,
            '__H3_SIZE__': this.styles.h3.fontSize,
            '__TABLE_PADDING__': this.styles.table.padding,
            '__TABLE_HEADER_SIZE__': this.styles.table.header.fontSize,
            '__TABLE_CELL_SIZE__': this.styles.table.cell.fontSize
        };

        // Replace all placeholders
        for (const [placeholder, value] of Object.entries(replacements)) {
            css = css.replace(new RegExp(placeholder, 'g'), value.toString());
        }

        return css;
    }

    async md_process(markdown: string): Promise<string> {
        // Parse markdown using marked
        const tokens = marked.lexer(markdown);
        
        // Check if we have any non-heading content
        const hasNonHeadingContent = tokens.some(token => 
            token.type !== 'heading' && token.type !== 'space'
        );
        
        // If only headings or empty content, return empty string
        if (!hasNonHeadingContent) {
            return '';
        }
        
        // Return the original markdown if it has content
        return markdown;
    }


    async add_content(markdown: string): Promise<void> {
        try {
            
            // Parse frontmatter and content using gray-matter
            const { data: frontMatter, content: parsedContent } = matter(markdown);
            let content = parsedContent.trim();
            
            // Process markdown content to check if it's empty
            const hasContent = await this.md_process(content);
            if (!hasContent) {
                console.log('No real content found after processing, skipping...');
                return;
            }

            // Use marked parser to check if first element is a header (level 1-3)
            let hasHeader = false;
            const tokens = marked.lexer(content);
            if (tokens.length > 0 && tokens[0].type === 'heading') {
                hasHeader = tokens[0].depth <= 3;
            }
            
            // Only add title as header if there's no header at all and title exists in frontmatter
            if (!hasHeader && frontMatter.title) {
                console.log(`Adding title as header: ${frontMatter.title}`);
                content = `# ${frontMatter.title}\n\n${content}`;
            }

            try {
                // Configure marked with custom renderer for images
                const renderer = new marked.Renderer();
                renderer.image = (href, title, text) => {
                    try {
                        // Check if image exists and is readable
                        if (href && !href.startsWith('http')) {
                            if (!fs.existsSync(href)) {
                                console.warn(`Warning: Image not found: ${href}`);
                                return `<div class="image-error">Image not found: ${text || href}</div>`;
                            }
                            // Convert image to base64
                            const imageData = fs.readFileSync(href);
                            const base64Image = imageData.toString('base64');
                            const mimeType = href.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
                            href = `data:${mimeType};base64,${base64Image}`;
                        }
                    } catch (error) {
                        console.warn(`Warning: Error processing image ${href}: ${error.message}`);
                        return `<div class="image-error">Error loading image: ${text || href}</div>`;
                    }
                    return `<div class="image-container"><img src="${href}" alt="${text || ''}" title="${title || ''}" /></div>`;
                };


                marked.setOptions({ renderer });



                // Convert markdown to HTML and handle Promise
                const html = await Promise.resolve(marked(content));
                //console.log(html)
                // Sanitize any potential handlebars syntax
                const sanitizedHtml = html.replace(/{{/g, '{ {').replace(/}}/g, '} }');
                // Wrap in section div
                this.content += `<div class="section">${sanitizedHtml}</div>`;
            } catch (error) {
                console.warn(`Warning: Error converting markdown to HTML: ${error.message}`);
                // Add error message to content
                this.content += `<div class="section error"><p>Error processing content: ${error.message}</p></div>`;
            }
        } catch (error) {
            console.error(`Error processing markdown: ${error.message}`);
        }
    }

    async add_md(markdownPath: string): Promise<void> {
        try {
            const markdown = fs.readFileSync(markdownPath, 'utf-8');
            await this.add_content(markdown)
        } catch (error) {
            console.error(`Error adding markdown file: ${error.message}`);
        }
        
    }
 

    add_pagebreak(): void {
        this.content += '<div style="page-break-after: always;"></div>';
    }

    add_header(level: 1 | 2 | 3, text: string): void {
        this.content += `<h${level}>${text}</h${level}>`;
    }

    async add_text(text: string, bold: boolean = false): Promise<void> {
        // Convert markdown to HTML and handle Promise
        const html = await Promise.resolve(marked(text));
        this.content += bold ? `<strong>${html}</strong>` : html;
    }

    add_table(data: Array<Array<{ content: string }>>, options: { headers?: string[] } = {}): void {
        let tableHtml = '<table>';
        
        if (options.headers) {
            tableHtml += '<thead><tr>';
            options.headers.forEach(header => {
                tableHtml += `<th>${header}</th>`;
            });
            tableHtml += '</tr></thead>';
        }
        
        tableHtml += '<tbody>';
        data.forEach(row => {
            tableHtml += '<tr>';
            row.forEach(cell => {
                tableHtml += `<td>${cell.content}</td>`;
            });
            tableHtml += '</tr>';
        });
        tableHtml += '</tbody></table>';
        
        this.content += tableHtml;
    }

    async save_pdf(outputPath: string): Promise<void> {
        // Build HTML without template literals
        const parts = [
            '<!DOCTYPE html>',
            '<html>',
            '<head>',
            '<meta charset="UTF-8">',
            '<style>',
            this.getDefaultCSS(),
            '</style>',
            '</head>',
            '<body>',
            '<div class="content-wrapper">',
            this.content,
            '</div>',
            '</body>',
            '</html>'
        ];
        const html = parts.join('\n');

        const options = {
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
            }
        };

        try {
            const buffer = await htmlPdf.generatePdf({ content: html }, options);
            fs.writeFileSync(outputPath, buffer);
        } catch (error) {
            console.error(`Error generating PDF: ${error.message}`);
            throw error; // Re-throw to handle in caller
        }
    }
}
