        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-center text-[10px] sm:text-[11px] font-medium tracking-wide">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            <><strong className="font-bold">Navigalex Advisory:</strong> We help Indian business owners assess financial, legal, governance and banking risks using AI-assisted analysis and professional review.</>
          </span>
        </div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-[0_1px_12px_rgba(15,23,42,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[76px] grid grid-cols-[290px_minmax(0,1fr)_190px] items-center gap-3">
          <button
            type="button"
            aria-label="Go to Navigalex home"
            className="flex items-center gap-2.5 min-w-0 group w-full"
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >