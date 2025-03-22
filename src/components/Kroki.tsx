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
  type = "", 
  format = 'svg', 
  className,
  style,
  maxWidth = '100%',
  children 
}) => {
  // Encode the diagram
  let src = '';
  let error = null;

  const additional = `
    @startuml
    !theme bluegray
    skinparam backgroundColor transparent
    skinparam shadowing false
    skinparam componentStyle rectangle
    
    skinparam defaultFontColor #CCCCCC
    skinparam ArrowColor #CCCCCC
    
    skinparam package {
      FontColor #CCCCCC
      BorderColor #CCCCCC
      BackgroundColor #111111
    }
    skinparam node {
      FontColor #CCCCCC
      BorderColor #CCCCCC
      BackgroundColor #444444
    }
    skinparam component {
      FontColor #CCCCCC
      BorderColor #CCCCCC
      BackgroundColor #333333
    }
    skinparam entity {
      FontColor #CCCCCC
      BorderColor #CCCCCC
      BackgroundColor #222222
    }
    skinparam actor {
      FontColor #CCCCCC
    }`;
    
  // Process the diagram content
  let diagramContent = children;
  
  // If type is empty and we're dealing with PlantUML
  if (type === "") {
    // Check if the first line is @startuml and remove it if present
    if (diagramContent.trim().startsWith('@startuml')) {
      diagramContent = diagramContent.replace(/^\s*@startuml\s*\n/, '');
    }
    
    // Add the additional styling at the beginning
    diagramContent = additional + '\n' + diagramContent;
    
    // Set type to plantuml since that's what we're using
    type = "plantuml";
  }

  try {
    const encoded = encode(diagramContent);
    src = `https://kroki.io/${type}/${format}/${encoded}`;
  } catch (err) {
    error = `Failed to encode diagram: ${err instanceof Error ? err.message : String(err)}`;
    console.error(error);
  }

  // State for showing/hiding the code block
  const [showCode, setShowCode] = React.useState(false);

  // Toggle code visibility
  const toggleCode = () => {
    setShowCode(!showCode);
  };

  return (
    <div className={className} style={style}>
      {error ? (
        <div style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px', marginBottom: '10px' }}>
          {error}
        </div>
      ) : (
        <>
          <img src={src} alt="Kroki diagram" style={{ maxWidth }} />
          <div style={{ marginTop: '10px', textAlign: 'right' }}>
            <button 
              onClick={toggleCode} 
              style={{ 
                background: 'none', 
                border: '1px solid #ccc', 
                borderRadius: '4px', 
                padding: '4px 8px', 
                cursor: 'pointer',
                fontSize: '12px',
                color: '#666'
              }}
            >
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>
          </div>
          {showCode && (
            <pre style={{ 
              marginTop: '10px', 
              padding: '10px', 
              backgroundColor: '#f5f5f5', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '12px',
              lineHeight: 1.4
            }}>
              <code>{diagramContent}</code>
            </pre>
          )}
        </>
      )}
    </div>
  );
};
