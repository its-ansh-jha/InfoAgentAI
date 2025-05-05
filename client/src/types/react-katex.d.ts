declare module 'react-katex' {
  import React from 'react';
  
  interface KatexProps {
    math: string;
    children?: React.ReactNode;
    errorColor?: string;
    renderError?: (error: Error | string) => React.ReactNode;
  }
  
  export const InlineMath: React.FC<KatexProps>;
  export const BlockMath: React.FC<KatexProps>;
}