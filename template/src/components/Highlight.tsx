import React from 'react';

type HighlightProps = {
  children: React.ReactNode;
  color: string;
};

const Highlight = ({ children, color }: HighlightProps): React.ReactElement => {
  return React.createElement('span', {
    style: {
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '0.2rem',
    },
    children,
  });
};

export default Highlight;
