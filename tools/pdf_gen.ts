import { BookCreator } from './src/lib/pdfmanager';
import path from 'path';
import os from 'os';

async function main() {
    try {
        const bookCreator = new BookCreator();
        
        // Create book structure from docs directory
        console.log('Creating book structure...');
        const book = await bookCreator.createBook('docs');
        
        // Log the book structure
        console.log('Book structure:');
        for (const section of book.sections) {
            console.log(`\nSection: ${section.label} (position: ${section.position})`);
            for (const page of section.pages) {
                console.log(`  - ${page.title} (position: ${page.position})`);
            }
        }
        
        // Generate PDF
        console.log('\nGenerating PDF...');
        const outputPath = path.join(os.homedir(), 'Downloads', 'zaz_products.pdf');
        await bookCreator.createPDF(book, outputPath);
        
        console.log(`PDF generated successfully at: ${outputPath}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Run the example
main().catch(console.error);
