import React from 'react';
import { deflate } from 'pako';

interface KrokiProps {
  type: string;
  format?: 'svg' | 'png';
  className?: string;
  style?: React.CSSProperties;
  maxWidth?: number | string; // Maximum width in pixels or CSS value (e.g., '100%', '500px')
  children: string;
}

/**
 * Function to encode text to UTF-8
 */
function textEncode(str: string): Uint8Array {
  if (window.TextEncoder) {
    return new TextEncoder().encode(str.trim());
  }
  const utf8 = unescape(encodeURIComponent(str.trim()));
  const result = new Uint8Array(utf8.length);
  for (let i = 0; i < utf8.length; i++) {
    result[i] = utf8.charCodeAt(i);
  }
  return result;
}

/**
 * Function to encode diagram for Kroki using deflate with binary data
 */
function encode(input: string): string {
  try {
    // Step 1: Encode the diagram as UTF-8
    const data = textEncode(input);
    
    // Step 2: Compress the diagram using deflate
    const compressed = deflate(data, { level: 9 });
    
    // Step 3: Convert compressed binary data to a string
    let binaryString = '';
    const bytes = new Uint8Array(compressed);
    for (let i = 0; i < bytes.length; i++) {
      binaryString += String.fromCharCode(bytes[i]);
    }
    
    // Step 4: Encode the binary string to base64
    const base64 = btoa(binaryString);
    
    // Step 5: Make the base64 URL safe
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (error) {
    console.error('Error encoding diagram:', error);
    throw error;
  }
}

/**
 * Kroki component for rendering diagrams using Kroki.io
 */
export const Kroki: React.FC<KrokiProps> = ({ 
  type, 
  format = 'svg', 
  className,
  style,
  maxWidth = '100%',
  children 
}) => {
  // Encode the diagram
  let src = '';
  let error = null;
  
  try {
    const encoded = encode(children);
    src = `https://kroki.io/${type}/${format}/${encoded}`;
  } catch (err) {
    error = `Failed to encode diagram: ${err instanceof Error ? err.message : String(err)}`;
    console.error(error);
  }

  return (
    <div className={className} style={style}>
      {error ? (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px', marginBottom: '10px' }}>
          {error}
        </div>
      ) : (
        <img src={src} alt="Kroki diagram" style={{ maxWidth }} />
      )}
    </div>
  );
};
