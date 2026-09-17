import type { ReactNode, CSSProperties } from 'react';
import { useInView } from '../hooks/use-in-view';
import classes from './reveal.module.css';

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
}

function Reveal({ children, className = '', style, delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`${classes.reveal} ${inView ? classes.revealVisible : ''} ${className}`}
      style={
        {
          ...style,
          '--reveal-delay': `${delay}ms`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

export default Reveal;
