        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[76px] grid grid-cols-[220px_minmax(0,1fr)_190px] items-center gap-3">
          <button
            type="button"
            aria-label="Go to Navigalex home"
            className="flex items-center gap-2.5 min-w-0 group w-full"
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm shadow-blue-600/20 shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </span>
            <span className="min-w-0 leading-none text-left">
              <span className="block text-[22px] sm:text-[25px] font-extrabold tracking-tight text-black whitespace-nowrap">NAVIGALEX</span>
              <span className="block mt-1 text-[10px] sm:text-[11px] text-black font-extrabold tracking-[0.18em] uppercase whitespace-nowrap">Executive Advisory</span>
            </span>
          </button>

          <nav className="hidden lg:flex min-w-0 items-center justify-center gap-0.5 xl:gap-1.5 font-semibold" aria-label="Primary navigation">
            {[
              ['home', 'Home'],
              ['live-tools', 'Live AI Scanners'],
              ['services', 'Our 9 Services'],
              ['why-pick-us', 'Why Pick These Products'],
              ['industries', 'Industries'],
              ['how-it-works', 'How It Works'],
              ['about', 'About'],
              ['contact', 'Contact']
            ].map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`px-2 xl:px-2.5 py-2 rounded-lg text-[14px] xl:text-[15px] leading-tight whitespace-nowrap text-black transition-colors hover:bg-slate-100 ${activeTab === tab ? 'text-black bg-slate-100' : 'text-black'}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2 shrink-0 w-full">
            <button
              onClick={() => openAssessmentForm()}
              className="hidden sm:inline-flex items-center justify-center w-full px-3 py-2.5 text-[14px] font-bold text-black bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm shadow-blue-600/20 transition-all cursor-pointer whitespace-nowrap"
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

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 sm:px-6 py-4 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {[
                ['home', 'Home'],
                ['live-tools', 'Live AI Scanners'],
                ['services', 'Our 9 Services'],
                ['why-pick-us', 'Why Pick These Products'],
                ['industries', 'Industries'],
                ['how-it-works', 'How It Works'],
                ['about', 'About'],
                ['contact', 'Contact']
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className={`text-left px-3 py-2.5 rounded-xl text-[14px] font-semibold text-black transition-colors ${activeTab === tab ? 'text-black bg-slate-100' : 'text-black hover:bg-slate-100'}`}
                >
                  {label}