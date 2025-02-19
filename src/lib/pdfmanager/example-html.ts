import { createHTMLPDFGenerator } from './index';

async function main() {
    // Create a new HTML-based PDF generator with default styles
    const generator = createHTMLPDFGenerator();

    // Add multiple markdown files
    generator.add_md('docs/1_introduction.md');
    generator.add_pagebreak();

    // Add a custom header
    generator.add_header(1, 'Custom Section');

    // Add some text with markdown formatting
    generator.add_text('This is a regular paragraph with **bold** text and *italic* text.');
    generator.add_text('This is bold text.', true);

    // Add a table
    const tableData = [
        [{ content: 'Header 1' }, { content: 'Header 2' }],
        [{ content: 'Cell 1' }, { content: 'Cell 2' }],
        [{ content: 'Cell 3' }, { content: 'Cell 4' }]
    ];
    generator.add_table(tableData, { headers: ['Header 1', 'Header 2'] });

    // Add some markdown content directly
    generator.add_text(`
# Markdown Example

This is a paragraph with **bold** and *italic* text.

## Lists

- Item 1
- Item 2
  - Nested item
- Item 3

1. Numbered item 1
2. Numbered item 2

## Code

\`\`\`typescript
function hello(name: string) {
    console.log(\`Hello, \${name}!\`);
}
\`\`\`

## Blockquote

> This is a blockquote
> It can span multiple lines

`);

    // Save the final PDF
    await generator.save_pdf('docs/example_output_html.pdf');

    console.log('PDF generated successfully using HTML renderer!');
}

main().catch(console.error);
