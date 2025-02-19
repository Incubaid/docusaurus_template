export interface PDFStyle {
    fontSize: number;
    font: string;
    style: string;
}

export interface PDFStyles {
    h1: PDFStyle;
    h2: PDFStyle;
    h3: PDFStyle;
    normal: PDFStyle;
    bold: PDFStyle;
    table: {
        header: PDFStyle;
        cell: PDFStyle;
        padding: number;
        borderWidth: number;
    };
    listMargin: number;
    lineHeight: number;
    pageWidth: number;
    pageHeight: number;
    marginLeft: number;
    marginRight: number;
    marginTop: number;
    marginBottom: number;
}

export interface TableCell {
    content: string;
    colspan?: number;
    rowspan?: number;
    align?: 'left' | 'center' | 'right';
}

export interface TableOptions {
    headers?: string[];
    widths?: number[];
    align?: ('left' | 'center' | 'right')[];
}

export interface ImageOptions {
    width?: number;
    height?: number;
    align?: 'left' | 'center' | 'right';
    caption?: string;
}

export type HeaderLevel = 1 | 2 | 3;
