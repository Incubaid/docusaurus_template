import { PDFStyles } from './types';

export const defaultStyles: PDFStyles = {
    h1: { fontSize: 20, font: 'InterMedium', style: 'normal' },
    h2: { fontSize: 16, font: 'InterMedium', style: 'normal' },
    h3: { fontSize: 14, font: 'InterMedium', style: 'normal' },
    normal: { fontSize: 11, font: 'InterRegular', style: 'normal' },
    bold: { fontSize: 11, font: 'InterMedium', style: 'normal' },
    table: {
        header: { fontSize: 11, font: 'InterMedium', style: 'normal' },
        cell: { fontSize: 11, font: 'InterRegular', style: 'normal' },
        padding: 5,
        borderWidth: 0.1
    },
    listMargin: 8,
    lineHeight: 4,
    pageWidth: 210, // A4 width in mm
    pageHeight: 297, // A4 height in mm
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    marginBottom: 20
};

// Calculate effective width (space available for content)
export const getEffectiveWidth = (styles: PDFStyles): number => {
    return styles.pageWidth - (styles.marginLeft + styles.marginRight);
};

// Calculate effective height (space available for content)
export const getEffectiveHeight = (styles: PDFStyles): number => {
    return styles.pageHeight - (styles.marginTop + styles.marginBottom);
};

// Helper to get style for header level
export const getHeaderStyle = (styles: PDFStyles, level: 1 | 2 | 3) => {
    switch (level) {
        case 1: return styles.h1;
        case 2: return styles.h2;
        case 3: return styles.h3;
        default: return styles.normal;
    }
};
