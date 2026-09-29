import { useEffect } from 'react';

const MARKERS = [
  'STEP-BY-STEP DELIVERY SCHEDULE',
  'INDICATIVE SCOPE FEE',
  'INPUTS NEEDED FROM YOU',
  'TANGIBLE DELIVERABLES YOU RECEIVE'
];

function isVisible(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const s = getComputedStyle(el);
  return r.width > 280 && r.height > 250 && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
}

function isPopup(el: HTMLElement) {
  if (!isVisible(el)) return false;
  const s = getComputedStyle(el);
  const text = (el.textContent || '').toUpperCase();
  const roleDialog = el.getAttribute('role') === 'dialog' || el.getAttribute('aria-modal') === 'true';
  const fixedLarge = s.position === 'fixed' && el.getBoundingClientRect().width > 320 && el.getBoundingClientRect().height > 250;
  const knownPopup = MARKERS.some((m) => text.includes(m));
  return roleDialog || fixedLarge || (knownPopup && el.getBoundingClientRect().width > 320);
}

export default function ModalCloseGuard() {
  useEffect(() => {
    const install = () => {
      const popups = Array.from(document.querySelectorAll<HTMLElement>('div, section, aside, dialog'))
        .filter(isPopup);

      popups.forEach((popup) => {
        let button = popup.querySelector<HTMLButtonElement>(':scope > [data-modal-close-guard]');
        if (button) return;

        const popupStyle = getComputedStyle(popup);
        if (popupStyle.position === 'static') popup.style.position = 'relative';

        button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('data-modal-close-guard', '1');
        button.setAttribute('aria-label', 'Close popup');
        button.title = 'Close popup';
        button.textContent = '×';

        Object.assign(button.style, {
          position: 'absolute',
          right: '14px',
          bottom: '14px',
          width: '48px',
          height: '48px',
          minWidth: '48px',
          minHeight: '48px',
          border: '2px solid rgba(255,255,255,.95)',
          borderRadius: '50%',
          background: '#111827',
          color: '#fff',
          fontFamily: 'Arial, sans-serif',
          fontSize: '32px',
          fontWeight: '700',
          lineHeight: '42px',
          textAlign: 'center',
          cursor: 'pointer',
          zIndex: '2147483647',
          boxShadow: '0 4px 16px rgba(0,0,0,.4)',
          padding: '0',
          margin: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto'
        });

        button.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          popup.style.display = 'none';
          popup.setAttribute('aria-hidden', 'true');
        };

        popup.appendChild(button);
      });
    };

    install();
    const observer = new MutationObserver(install);
    observer.observe(document.body, { childList: true, subtree: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-modal-close-guard]'));
      const visible = buttons.filter((b) => isVisible(b));
      visible.at(-1)?.click();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return null;
}
