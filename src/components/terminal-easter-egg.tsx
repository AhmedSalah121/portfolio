import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/use-reduced-motion';
import { contactInfo, aboutText } from '../data/contact';
import { frontendTechs, backendTechs, tools, aimlTechs } from '../data/tech';
import classes from './terminal-easter-egg.module.css';

type Line = { id: number; text: string; kind: 'input' | 'output' | 'system' };

const KONAMI: string[] = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const FORTUNES = [
  'Your bugs will fix themselves. Probably not.',
  'Commit early, commit often.',
  'It works on my machine™',
  '404: motivation not found — try coffee.',
];

export default function TerminalEasterEgg() {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([
    { id: 0, text: 'welcome — type help for commands', kind: 'system' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const nextIdRef = useRef(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  const openTerminal = useCallback(() => {
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    setOpen(true);
  }, []);

  const closeTerminal = useCallback(() => {
    setOpen(false);
  }, []);

  // restore focus on close
  useEffect(() => {
    if (!open && prevFocusRef.current) {
      prevFocusRef.current.focus();
      prevFocusRef.current = null;
    }
    if (open) {
      // focus input after open animation
      const t = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  // auto-scroll output
  useEffect(() => {
    if (open && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines, open]);

  // Konami code trigger — no visible hint, only when no input focused
  useEffect(() => {
    let idx = 0;
    const onKeyDown = (e: KeyboardEvent) => {
      if (open) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;

      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expected = KONAMI[idx];
      const expectedNorm = expected.length === 1 ? expected.toLowerCase() : expected;

      if (key === expectedNorm) {
        idx += 1;
        if (idx === KONAMI.length) {
          idx = 0;
          openTerminal();
        }
      } else {
        // reset, but handle overlapping prefix (e.g. ArrowUp)
        if (key === KONAMI[0].toLowerCase() || key === KONAMI[0]) {
          idx = 1;
        } else {
          idx = 0;
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, openTerminal]);

  // close on Escape, trap focus
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeTerminal();
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, closeTerminal]);

  const runCommand = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === '') return;
    const id = nextIdRef.current++;
    setLines((prev) => [...prev, { id, text: `> ${trimmed}`, kind: 'input' as const }]);
    setHistory((h) => [...h, trimmed]);
    setHistoryIndex(-1);

    const cmd = trimmed.toLowerCase();
    let output = '';

    if (cmd === 'help') {
      output = 'available: help · whoami · skills · sudo · clear · fortune';
    } else if (cmd === 'whoami') {
      output = `${contactInfo.name} — ${contactInfo.title}. ${aboutText}`;
    } else if (cmd === 'skills') {
      const all = [...frontendTechs, ...backendTechs, ...tools, ...aimlTechs].map((t) => t.name);
      output = all.join(' · ');
    } else if (cmd === 'sudo') {
      output = 'Nice try.';
    } else if (cmd === 'clear') {
      setLines([]);
      return;
    } else if (cmd === 'fortune') {
      output = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    } else {
      output = `command not found: ${trimmed}`;
    }

    const outId = nextIdRef.current++;
    setLines((prev) => [...prev, { id: outId, text: output, kind: 'output' as const }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input;
    setInput('');
    runCommand(value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      if (history.length === 0) return;
      e.preventDefault();
      const next = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      if (historyIndex === -1) return;
      e.preventDefault();
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className={`${classes.overlay} ${reducedMotion ? classes.noMotion : ''}`}
      onClick={closeTerminal}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terminal-title"
        className={classes.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.header}>
          <span id="terminal-title" className={classes.title}>
            terminal
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            className={classes.close}
            onClick={closeTerminal}
            aria-label="Close terminal"
          >
            ×
          </button>
        </div>

        <div ref={outputRef} className={classes.output}>
          {lines.map((l) => (
            <div key={l.id} className={l.kind === 'input' ? classes.lineInput : l.kind === 'system' ? classes.lineSystem : classes.lineOutput}>
              {l.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className={classes.form}>
          <span className={classes.prompt} aria-hidden="true">
            {'>'}
          </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className={classes.input}
            aria-label="Terminal input"
            autoComplete="off"
            spellCheck={false}
          />
          <span className={classes.cursor} aria-hidden="true" />
        </form>
      </div>
    </div>
  );
}
