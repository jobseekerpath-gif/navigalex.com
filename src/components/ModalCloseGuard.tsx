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
        return r.width > 500 && r.height > 300 && s.position === 'fixed' || s.position === 'absolute';
      });
      const modal = candidates.sort((a, b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height - a.getBoundingClientRect().width * a.getBoundingClientRect().height)[0] as HTMLElement | undefined;
      if (!modal || modal.dataset.closeGuard === '1') return;
      modal.dataset.closeGuard = '1';
      modal.style.position = 'fixed';
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', 'Close');
      button.textContent = '×';
      Object.assign(button.style, {
        position: 'absolute', top: '12px', right: '14px', width: '38px', height: '38px',
        border: '0', borderRadius: '50%', background: '#111827', color: '#fff',
        fontSize: '26px', lineHeight: '38px', cursor: 'pointer', zIndex: '99999'
      });
      button.onclick = (e) => {
        e.preventDefault(); e.stopPropagation();
        modal.style.display = 'none';
      };
      modal.appendChild(button);
    };
    install();
    const observer = new MutationObserver(install);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}
