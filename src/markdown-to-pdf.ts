import { jsPDF } from 'jspdf';
import { marked } from 'marked';
import * as fs from 'fs';
import * as path from 'path';

// Load Inter fonts
const interRegular = fs.readFileSync('static/fonts/Inter_28pt-Regular.ttf');
const interMedium = fs.readFileSync('static/fonts/Inter_28pt-Medium.ttf');
const interLight = fs.readFileSync('static/fonts/Inter_28pt-Light.ttf');

// PDF styling configuration
const styles = {
    title: { fontSize: 20, font: 'InterMedium', style: 'normal' },
    h1: { fontSize: 18, font: 'InterMedium', style: 'normal' },
    normal: { fontSize: 11, font: 'InterRegular', style: 'normal' },
    bold: { fontSize: 11, font: 'InterMedium', style: 'normal' },
    listMargin: 10,
    lineHeight: 6,
    pageWidth: 210, // A4 width in mm
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20
};

class MarkdownToPDF {
    private doc: jsPDF;
    private currentY: number;
    private pageHeight: number;
    private effectiveWidth: number;

    constructor() {
        this.doc = new jsPDF();
        
        // Add fonts to the PDF document
        this.doc.addFileToVFS('Inter-Regular.ttf', interRegular.toString('base64'));
        this.doc.addFileToVFS('Inter-Medium.ttf', interMedium.toString('base64'));
        this.doc.addFileToVFS('Inter-Light.ttf', interLight.toString('base64'));
        
        this.doc.addFont('Inter-Regular.ttf', 'InterRegular', 'normal');
        this.doc.addFont('Inter-Medium.ttf', 'InterMedium', 'normal');
        this.doc.addFont('Inter-Light.ttf', 'InterLight', 'normal');
        this.currentY = styles.marginTop;
        this.pageHeight = this.doc.internal.pageSize.height;
        this.effectiveWidth = styles.pageWidth - (styles.marginLeft + styles.marginRight);
    }

    private checkAndAddPage() {
        if (this.currentY > this.pageHeight - 20) {
            this.doc.addPage();
            this.currentY = styles.marginTop;
        }
    }

    private addText(text: string, options: { fontSize: number; font: string; style: string }) {
        this.doc.setFont(options.font, options.style);
        this.doc.setFontSize(options.fontSize);

        const lines = this.doc.splitTextToSize(text, this.effectiveWidth);
        lines.forEach((line: string) => {
            this.checkAndAddPage();
            this.doc.text(line, styles.marginLeft, this.currentY);
            this.currentY += options.fontSize * 0.35;
        });

        this.currentY += styles.lineHeight;
    }

    private processList(items: string[], isOrdered: boolean = false) {
        items.forEach((item: string, index: number) => {
            this.checkAndAddPage();
            const bullet = isOrdered ? `${index + 1}.` : '•';
            const itemText = item.replace(/^\s*\d+\.\s*|\s*•\s*/, ''); // Remove existing bullets/numbers
            
            // Calculate the width available for text after bullet and margin
            const bulletWidth = this.doc.getTextWidth(bullet + ' ');
            const listStartX = styles.marginLeft + styles.listMargin;
            const textWidth = this.effectiveWidth - styles.listMargin - bulletWidth;
            
            // Draw the bullet
            this.doc.setFont(styles.normal.font, styles.normal.style);
            this.doc.setFontSize(styles.normal.fontSize);
            this.doc.text(bullet, styles.marginLeft, this.currentY);
            
            // Process the text with bold parts
            let combinedText = '';
            const parts = itemText.split(/(\*\*.*?\*\*)/);
            
            parts.forEach(part => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    combinedText += part.replace(/\*\*/g, '');
                } else if (part.trim()) {
                    combinedText += part;
                }
            });
            
            // Wrap and draw the text
            const lines = this.doc.splitTextToSize(combinedText, textWidth);
            lines.forEach((line: string, lineIndex: number) => {
                if (lineIndex > 0) {
                    this.currentY += styles.normal.fontSize * 0.35;
                    this.checkAndAddPage();
                }
                this.doc.text(line, listStartX, this.currentY);
            });
            
            this.currentY += styles.lineHeight;
        });
    }

    public convert(markdown: string, outputPath: string) {
        // Parse markdown content
        const tokens = marked.lexer(markdown);
        
        tokens.forEach(token => {
            switch (token.type) {
                case 'heading':
                    const style = token.depth === 1 ? styles.h1 : styles.normal;
                    this.addText(token.text, style);
                    break;
                    
                case 'list':
                    this.processList(token.items.map(item => item.text), token.ordered);
                    break;
                    
                case 'paragraph':
                    this.addText(token.text, styles.normal);
                    break;
                    
                case 'space':
                    this.currentY += styles.lineHeight;
                    break;
            }
        });

        // Save the PDF
        this.doc.save(outputPath);
    }
}

// Main execution
const inputPath = 'docs/1_introduction.md';
const outputPath = 'docs/output.pdf';

try {
    // Read markdown file
    const markdown = fs.readFileSync(inputPath, 'utf-8');
    
    // Remove frontmatter
    const content = markdown.replace(/^---[\s\S]*?---/, '').trim();
    
    // Convert to PDF
    const converter = new MarkdownToPDF();
    converter.convert(content, outputPath);
    
    console.log(`PDF successfully created at: ${outputPath}`);
} catch (error) {
    console.error('Error:', error);
}
