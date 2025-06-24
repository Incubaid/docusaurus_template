import * as fs from 'fs';
import * as path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { HTMLPDFGenerator } from './html-generator';

interface CategoryInfo {
    label: string;
    position: number;
}

interface PageInfo {
    title: string;
    position: number;
    path: string;
}

interface BookSection {
    label: string;
    position: number;
    pages: PageInfo[];
}

interface Book {
    sections: BookSection[];
}

export class BookCreator {
    private validateMarkdown(content: string, filePath: string): boolean {
        // Check for basic markdown structure
        if (!content.trim()) {
            console.warn(`Warning: Empty markdown file: ${filePath}`);
            return false;
        }


        // Check for valid frontmatter
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontMatterMatch) {
            console.warn(`Warning: Missing or invalid frontmatter in: ${filePath}`);
            return false;
        }

        // Check for malformed content
        try {
            const cleanContent = content.replace(/^---[\s\S]*?---/, '').trim();
            marked(cleanContent); // Try parsing markdown
            return true;
        } catch (error) {
            console.warn(`Warning: Invalid markdown content in ${filePath}: ${error.message}`);
            return false;
        }
    }

    private parseFrontMatter(content: string, filePath: string): { title: string; position: number; draft: boolean } | null {
        try {
            const { data } = matter(content);

            if (!data.title) {
                console.warn(`Warning: Missing title in frontmatter: ${filePath}`);
                return null;
            }

            return {
                title: data.title,
                position: parseInt(data.sidebar_position?.toString() || '0', 10),
                draft: !!data.draft
            };
        } catch (error) {
            console.warn(`Warning: Error parsing frontmatter in ${filePath}: ${error.message}`);
            return null;
        }
    }

    private async readCategoryInfo(dirPath: string): Promise<CategoryInfo | null> {
        const categoryPath = path.join(dirPath, '_category_.json');
        try {
            if (fs.existsSync(categoryPath)) {
                const content = await fs.promises.readFile(categoryPath, 'utf-8');
                const data = JSON.parse(content);
                return {
                    label: data.label || path.basename(dirPath),
                    position: data.position || 0
                };
            }
        } catch (error) {
            console.error(`Error reading category info from ${categoryPath}:`, error);
        }
        return null;
    }

    private async scanDirectory(dirPath: string): Promise<BookSection | null> {
        const categoryInfo = await this.readCategoryInfo(dirPath);
        if (!categoryInfo) return null;

        const pages: PageInfo[] = [];
        const files = await fs.promises.readdir(dirPath);

        for (const file of files) {
            if (file === '_category_.json') continue;
            
            const filePath = path.join(dirPath, file);
            const stat = await fs.promises.stat(filePath);

            if (stat.isFile() && file.endsWith('.md')) {
                try {
                    const content = await fs.promises.readFile(filePath, 'utf-8');
                    
                    // Validate markdown content
                    if (!this.validateMarkdown(content, filePath)) {
                        continue;
                    }

                    const frontMatter = this.parseFrontMatter(content, filePath);
                    if (frontMatter && !frontMatter.draft) {
                        pages.push({
                            title: frontMatter.title,
                            position: frontMatter.position,
                            path: filePath
                        });
                    }
                } catch (error) {
                    console.warn(`Warning: Error reading file ${filePath}: ${error.message}`);
                    continue;
                }
            }
        }

        // Sort pages by position
        pages.sort((a, b) => a.position - b.position);

        return {
            label: categoryInfo.label,
            position: categoryInfo.position,
            pages
        };
    }

    private async scanRootFiles(rootDir: string): Promise<PageInfo[]> {
        const pages: PageInfo[] = [];
        const entries = await fs.promises.readdir(rootDir);

        for (const file of entries) {
            if (file.endsWith('.md')) {
                const filePath = path.join(rootDir, file);
                const stat = await fs.promises.stat(filePath);

                if (stat.isFile()) {
                    const content = await fs.promises.readFile(filePath, 'utf-8');
                    
                    // Validate markdown content
                    if (!this.validateMarkdown(content, filePath)) {
                        continue;
                    }

                    const frontMatter = this.parseFrontMatter(content, filePath);
                    if (frontMatter && !frontMatter.draft) {
                        pages.push({
                            title: frontMatter.title,
                            position: frontMatter.position,
                            path: filePath
                        });
                    }
                }
            }
        }

        // Sort root pages by position
        pages.sort((a, b) => a.position - b.position);
        return pages;
    }

    async createBook(rootDir: string): Promise<Book> {
        const book: Book = { sections: [] };

        // First, scan root-level markdown files
        const rootPages = await this.scanRootFiles(rootDir);
        if (rootPages.length > 0) {
            book.sections.push({
                label: 'Introduction',
                position: 0,
                pages: rootPages
            });
        }

        // Then scan subdirectories with _category_.json
        const entries = await fs.promises.readdir(rootDir, { withFileTypes: true });
        for (const entry of entries) {
            if (entry.isDirectory()) {
                const dirPath = path.join(rootDir, entry.name);
                const section = await this.scanDirectory(dirPath);
                if (section) {
                    book.sections.push(section);
                }
            }
        }

        // Sort sections by position
        book.sections.sort((a, b) => a.position - b.position);
        return book;
    }

    private async processMarkdownContent(content: string, filePath: string): Promise<string | null> {
        // Remove frontmatter
        const cleanContent = content.replace(/^---[\s\S]*?---/, '').trim();
        
        // Extract title from frontmatter
        const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        let title = '';
        if (frontMatterMatch) {
            const frontMatter = frontMatterMatch[1];
            const titleMatch = frontMatter.match(/title:\s*['"](.+)['"]/);
            if (titleMatch) {
                title = titleMatch[1];
            }
        }

        // Check if content only contains a title or title + HTML block
        const contentWithoutTitle = cleanContent.replace(/^#\s+[^\n]+\n*/g, '').trim();
        if (!contentWithoutTitle) {
            console.log(`Skipping page with only title: ${filePath}`);
            return null;
        }

        // Check if remaining content is only HTML blocks
        const contentWithoutLinks = contentWithoutTitle.replace(/<a[^>]*>.*?<\/a>/g, '').trim();
        const isOnlyHtmlBlocks = /^(?:<div[^>]*>(?:[^<]*|(?:<(?!\/div>)[^>]*>)*)*<\/div>\s*)*$/g.test(contentWithoutLinks);
        if (isOnlyHtmlBlocks) {
            console.log(`Skipping page with only title and HTML blocks: ${filePath}`);
            return null;
        }

        // Process image paths to make them absolute
        const baseDir = path.dirname(filePath);
        let processedContent = cleanContent.replace(
            /!\[([^\]]*)\]\(([^)]+)\)/g,
            (match, alt, imgPath) => {
                // Make relative image paths absolute
                if (!imgPath.startsWith('http') && !imgPath.startsWith('/')) {
                    const absolutePath = path.resolve(baseDir, imgPath);
                    return `![${alt}](${absolutePath})`;
                }
                return match;
            }
        );

        // Check if content already has a header
        const hasHeader = /^#\s+\S/m.test(processedContent);
        
        // Add title as header if no header exists
        if (!hasHeader && title) {
            processedContent = `# ${title}\n\n${processedContent}`;
        }
        
        return processedContent;
    }

    private async estimateContentSize(content: string): Promise<number> {
        // Simple estimation based on character count and number of headers
        const headerCount = (content.match(/^#/gm) || []).length;
        return content.length + (headerCount * 100); // Headers get extra weight
    }

    async createPDF(book: Book, outputPath: string, styles: any = {}): Promise<void> {
        const generator = new HTMLPDFGenerator(styles);
        let isFirstSection = true;

        for (const section of book.sections) {
            if (!isFirstSection) {
                generator.add_pagebreak();
            }
            isFirstSection = false;

            // Add section header
            // generator.add_header(1, section.label);

            for (const page of section.pages) {
                const content = await fs.promises.readFile(page.path, 'utf-8');
                const processedContent = await this.processMarkdownContent(content, page.path);
                
                // Skip if processedContent is null (empty or HTML-only page)
                if (!processedContent) continue;

                // Write content directly without temporary file
                await generator.add_content(processedContent);
            }
        }

        await generator.save_pdf(outputPath);
    }
}
