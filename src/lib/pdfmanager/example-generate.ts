import { createPDFGenerator } from './index';

// Create a new PDF generator with default styles
const generator = createPDFGenerator();

// Add multiple markdown files
generator.add_md('docs/1_introduction.md');
generator.add_pagebreak();

// Add a custom header
generator.add_header(1, 'Custom Section');

// Add some text
generator.add_text('This is a regular paragraph.');
generator.add_text('This is bold text.', true);

// Add a table
const tableData = [
    [{ content: 'Header 1' }, { content: 'Header 2' }],
    [{ content: 'Cell 1' }, { content: 'Cell 2' }],
    [{ content: 'Cell 3' }, { content: 'Cell 4' }]
];
generator.add_table(tableData, { headers: ['Header 1', 'Header 2'] });

// Add a table with some spacing
generator.add_text('\n');
generator.add_table(tableData, { headers: ['Header 1', 'Header 2'] });
generator.add_text('\n');

// Save the final PDF
generator.save_pdf('docs/example_output.pdf');

console.log('PDF generated successfully!');
