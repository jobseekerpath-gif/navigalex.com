import { useEffect } from 'react';

const MARKERS = ['STEP-BY-STEP DELIVERY SCHEDULE', 'INDICATIVE SCOPE FEE', 'INPUTS NEEDED FROM YOU'];

export default function ModalCloseGuard() {
  useEffect(() => {
    const install = () => {
      const candidates = Array.from(document.querySelectorAll('div')).filter((el) => {
        const text = (el.textContent || '').toUpperCase();
        if (!MARKERS.some((m) => text.includes(m))) return false;

        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        return r.width > 280 && r.height > 350 && s.position === 'fixed';
      });

      const modal = candidates.sort(
        (a, b) =>
          b.getBoundingClientRect().width * b.getBoundingClientRect().height -
          a.getBoundingClientRect().width * a.getBoundingClientRect().height
      )[0] as HTMLElement | undefined;

      if (!modal) return;

      let button = modal.querySelector<HTMLButtonElement>('[data-modal-close-guard]');
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('data-modal-close-guard', '1');
        button.setAttribute('aria-label', 'Close popup');
        button.title = 'Close popup';
        button.textContent = '×';

        Object.assign(button.style, {
          position: 'fixed',
          top: '12px',
          right: '12px',
          width: '44px',
          height: '44px',
          border: '2px solid rgba(255,255,255,.85)',
          borderRadius: '50%',
          background: '#111827',
          color: '#fff',
          fontSize: '30px',
          lineHeight: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          zIndex: '2147483647',
          boxShadow: '0 4px 16px rgba(0,0,0,.35)',
          padding: '0'
        });

        button.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          modal.style.display = 'none';
        };

        modal.appendChild(button);
      }
    };

    install();
    const observer = new MutationObserver(install);
    observer.observe(document.body, { childList: true, subtree: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const button = document.querySelector<HTMLButtonElement>('[data-modal-close-guard]');
      button?.click();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return null;
}
