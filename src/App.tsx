      </div>

      {/* Clean brand strip */}
      <div className="bg-slate-950 text-white/90 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-8 flex items-center justify-center text-[10px] sm:text-[11px] font-medium tracking-wide">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            AI-assisted analysis. Professional review where included in scope.
          </span>
        </div>
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-[0_1px_12px_rgba(15,23,42,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          <button
            type="button"
            aria-label="Go to Navigalex home"
            className="flex items-center gap-2.5 min-w-0 group"
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm shadow-blue-600/20 shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </span>
            <span className="min-w-0 leading-none text-left">
              <span className="block text-lg sm:text-xl font-extrabold tracking-tight text-slate-950">NAVIGALEX</span>
              <span className="block mt-1 text-[8px] sm:text-[9px] text-blue-600 font-extrabold tracking-[0.18em] uppercase">Executive Advisory</span>
            </span>
          </button>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-[11px] xl:text-xs font-semibold text-slate-600" aria-label="Primary navigation">
            {[
              ['home', 'Home'],
              ['live-tools', 'AI Assessments'],
              ['services', 'Services'],
              ['why-pick-us', 'Why Navigalex'],
              ['industries', 'Industries'],
              ['how-it-works', 'How It Works'],
              ['about', 'About'],
              ['contact', 'Contact']
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-2.5 xl:px-3 py-2 rounded-lg transition-colors hover:text-blue-600 hover:bg-blue-50/70 ${activeTab === tab ? 'text-blue-700 bg-blue-50' : ''}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openAssessmentForm()}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
            >
              Request Assessment
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-4 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {[
                ['home', 'Home'],
                ['live-tools', 'AI Assessments'],
                ['services', 'Services'],
                ['why-pick-us', 'Why Navigalex'],
                ['industries', 'Industries'],
                ['how-it-works', 'How It Works'],
                ['about', 'About'],
                ['contact', 'Contact']
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab ? 'text-blue-700 bg-blue-50' : 'text-slate-700 hover:bg-slate-50'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => { openAssessmentForm(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-sm"
              >
                Request a Confidential Assessment
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">