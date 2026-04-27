export const SdkPageLayout = ({ sdk, version, title, versions, groups, currentPage, allSdks, page }) => {

  // All declarations inside component — Mintlify's MDX compiler wraps snippet files
  // in a function scope, making module-level declarations inaccessible to exports.

  const SDK_CSS = `
    .sdk-back { display:inline-flex;align-items:center;gap:6px;font-size:.8125rem;text-decoration:none;color:var(--muted);font-family:inherit;transition:color .15s }
    .sdk-back:hover { color:var(--text) }

    .sdk-select { width:100%;display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 8px 6px 10px;font-size:.8125rem;border:1px solid var(--input-border);border-radius:6px;background:var(--input-bg);color:var(--text);cursor:pointer;text-align:left;font-family:inherit;transition:border-color .15s }
    .sdk-select:hover { border-color:var(--muted) }
    .sdk-select-menu { position:absolute;top:calc(100% + 4px);left:0;right:0;z-index:50;padding:4px;border:1px solid var(--input-border);border-radius:6px;background:var(--input-bg);box-shadow:0 4px 12px rgba(0,0,0,.12) }
    .sdk-select-search { width:100%;padding:5px 8px;margin-bottom:4px;font-size:.8125rem;border:1px solid var(--input-border);border-radius:4px;background:var(--input-bg);color:var(--text);font-family:inherit;outline:none;box-sizing:border-box }
    .sdk-select-search:focus { border-color:var(--accent) }
    .sdk-select-opt { width:100%;display:flex;align-items:center;gap:8px;padding:6px 8px;font-size:.8125rem;text-align:left;border-radius:4px;background:transparent;color:var(--muted);border:none;cursor:pointer;font-family:inherit;transition:background .1s,color .1s }
    .sdk-select-opt:hover,.sdk-select-opt--active { background:rgba(0,0,0,.05);color:var(--text) }
    .dark .sdk-select-opt:hover,.dark .sdk-select-opt--active { background:rgba(255,255,255,.07) }
    .sdk-select-opt-label { flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap }
    .sdk-select-opt-check { flex-shrink:0;color:var(--accent) }
    .sdk-select-empty { padding:8px;font-size:.8125rem;color:var(--muted);text-align:center }

    .sdk-nav-link { display:flex;align-items:center;justify-content:space-between;gap:6px;padding:5px 12px;font-size:.875rem;text-decoration:none;border-radius:6px;margin:1px 8px;line-height:1.5;color:var(--muted);font-family:inherit;transition:color .1s,background .1s }
    .sdk-nav-link:hover { color:var(--text);background:rgba(0,0,0,.05) }
    .sdk-nav-link--active { font-weight:500;color:var(--text);background:rgba(0,0,0,.05) }
    .dark .sdk-nav-link:hover,.dark .sdk-nav-link--active { background:rgba(255,255,255,.07) }
    .sdk-nav-link-title { flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap }

    .sdk-kind { display:inline-flex;align-items:center;justify-content:center;height:15px;padding:0 4px;border-radius:3px;font-size:.6rem;font-weight:700;letter-spacing:.03em;font-family:ui-monospace,monospace;flex-shrink:0;text-transform:lowercase }
    .sdk-kind-function  { background:rgba(96,165,250,.15);color:#3b82f6 }
    .sdk-kind-class     { background:rgba(251,146,60,.15);color:#f97316 }
    .sdk-kind-interface { background:rgba(52,211,153,.15);color:#10b981 }
    .sdk-kind-type      { background:rgba(167,139,250,.15);color:#8b5cf6 }
    .sdk-kind-variable  { background:rgba(251,191,36,.15);color:#d97706 }
    .dark .sdk-kind-function  { background:rgba(96,165,250,.18);color:#60a5fa }
    .dark .sdk-kind-class     { background:rgba(251,146,60,.18);color:#fb923c }
    .dark .sdk-kind-interface { background:rgba(52,211,153,.18);color:#34d399 }
    .dark .sdk-kind-type      { background:rgba(167,139,250,.18);color:#a78bfa }
    .dark .sdk-kind-variable  { background:rgba(251,191,36,.18);color:#fbbf24 }

    .sdk-ver-badge { display:inline-flex;align-items:center;padding:1px 6px;border-radius:9999px;font-size:.65rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase }

    .sdk-divider { height:2px;width:100%;background:repeating-linear-gradient(to right,var(--dash-color,#e9eaec) 0,var(--dash-color,#e9eaec) 8px,transparent 8px,transparent 16px);margin:20px 0 }

    .sdk-toc-link { display:block;padding:3px 0;font-size:.8125rem;text-decoration:none;line-height:1.6;color:var(--muted);transition:color .15s }
    .sdk-toc-link:hover { color:var(--text) }

    /* ── Scrollbars ── */
    .sdk-sidebar::-webkit-scrollbar,.sdk-main::-webkit-scrollbar { width:4px }
    .sdk-sidebar::-webkit-scrollbar-track,.sdk-main::-webkit-scrollbar-track { background:transparent }
    .sdk-sidebar::-webkit-scrollbar-thumb,.sdk-main::-webkit-scrollbar-thumb { background:#888888ae;border-radius:4px }
    .sdk-sidebar { scrollbar-width:thin;scrollbar-color:#888 transparent;overscroll-behavior:contain }
    .sdk-main    { scrollbar-width:thin;scrollbar-color:#888 transparent }
    .sdk-toc::-webkit-scrollbar { width:0 }
    .sdk-toc { scrollbar-width:none }

    /* ── Code blocks ── */
    .sdk-code { border-radius:8px;overflow:hidden;margin-bottom:1rem;background:#0d1117;border:1px solid #30363d }
    .sdk-code-header { display:flex;align-items:center;justify-content:space-between;padding:6px 8px 6px 14px;border-bottom:1px solid #30363d;background:#161b22;min-height:36px }
    .sdk-code-lang { font-size:.75rem;color:#7d8590;font-family:ui-monospace,monospace;line-height:1 }
    .sdk-code-copy { display:flex;align-items:center;padding:4px 6px;border-radius:4px;border:1px solid #30363d;background:transparent;cursor:pointer;color:#7d8590;transition:color .15s,background .15s;flex-shrink:0 }
    .sdk-code-copy:hover { background:#21262d;color:#c9d1d9 }
    .sdk-code-copy--done { color:#3fb950 }

    .sdk-prose-link { color:var(--accent);border-bottom:1px solid currentColor;font-weight:500;text-decoration:none }
    .sdk-prose-link:hover { border-bottom-width:2px }

    /* ── SDK icons: CSS-based light/dark swap ── */
    .sdk-icon-light { display:inline-block }
    .sdk-icon-dark  { display:none }
    .dark .sdk-icon-light { display:none }
    .dark .sdk-icon-dark  { display:inline-block }


    /* ── Layout ── */
    .sdk-layout { display:flex;width:100%;max-width:1440px;margin-left:auto;margin-right:auto;height:calc(100vh - 60px);overflow:hidden }
    .sdk-content-region { flex:1;display:flex;min-width:0;height:100% }

    /* ── Responsive breakpoints ── */

    /* 1280px+: full three-column layout, TOC visible */
    @media (min-width:1280px) {
      .sdk-toc { display:flex;flex-direction:column }
    }

    /* 768px–1279px: sidebar + content, TOC hidden */
    @media (max-width:1279px) {
      .sdk-toc { display:none }
    }

    /* Below 768px: sidebar hidden — Mintlify's topbar hamburger handles mobile nav */
    @media (max-width:767px) {
      .sdk-sidebar { display:none }
      .sdk-main { padding:1.25rem 1.25rem 4rem !important }
    }
  `;

  // ── SDK icons — uses /docs/images/icons/{light,dark}/*.svg
  //    Icon filenames come from allSdks prop (set by the generator) so no
  //    manual mapping is needed here when a new SDK is added.

  // Build a local sdkId → icon filename lookup from the allSdks prop data.
  const sdkIconMap = Object.fromEntries(
    (allSdks || []).filter(s => s.icon).map(s => [s.id, s.icon])
  );

  const sdkIcon = (sdkId) => {
    const file = sdkIconMap[sdkId];
    if (file) {
      return (
        <>
          <img className="sdk-icon-light" src={`/docs/images/icons/light/${file}.svg`} width="16" height="16" alt="" aria-hidden="true" style={{ flexShrink:0 }} />
          <img className="sdk-icon-dark"  src={`/docs/images/icons/dark/${file}.svg`}  width="16" height="16" alt="" aria-hidden="true" style={{ flexShrink:0 }} />
        </>
      );
    }
    const letter = (sdkId || '?')[0].toUpperCase();
    return (
      <span style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',width:16,height:16,borderRadius:3,background:'var(--border)',color:'var(--muted)',fontSize:'.65rem',fontWeight:700,fontFamily:'ui-monospace,monospace',flexShrink:0 }}>
        {letter}
      </span>
    );
  };

  // ── Kind badge ────────────────────────────────────────────────────────────────

  const KIND_ABBREV = { function: 'fn', class: 'cls', interface: 'if', type: 'type', variable: 'var' };

  const kindBadge = (kind) => {
    if (!kind) return null;
    const label = KIND_ABBREV[kind] ?? kind.slice(0, 4);
    return <span className={`sdk-kind sdk-kind-${kind}`}>{label}</span>;
  };

  // ── Version badge ─────────────────────────────────────────────────────────────

  const VER_STATUS = {
    active:     { color: '#16a34a', bg: 'rgba(22,163,74,.1)',  border: '#bbf7d0' },
    deprecated: { color: '#dc2626', bg: 'rgba(220,38,38,.1)',  border: '#fecaca' },
    legacy:     { color: '#d97706', bg: 'rgba(217,119,6,.1)',  border: '#fde68a' },
    beta:       { color: '#7c3aed', bg: 'rgba(124,58,237,.1)', border: '#ddd6fe' },
  };

  const verBadge = (status) => {
    const cfg = VER_STATUS[status] ?? VER_STATUS.active;
    return (
      <span className="sdk-ver-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
        {status}
      </span>
    );
  };

  // ── Safe inline markdown renderer (returns React elements, no HTML strings) ───
  // Parses: `code`, **bold**, *italic*, [link](url)
  // No dangerouslySetInnerHTML — React auto-escapes all text nodes.

  const renderInline = (text) => {
    if (!text) return null;
    const pattern = /(`[^`]+`|\*\*.*?\*\*|\*.*?\*|\[[^\]]+\]\([^)]+\))/g;
    const parts = [];
    let last = 0;
    let m;
    let key = 0;
    while ((m = pattern.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      const tok = m[0];
      if (tok.startsWith('`')) {
        parts.push(<code key={key++} style={{ fontFamily:'ui-monospace,monospace', background:'var(--border)', padding:'1px 5px', borderRadius:'3px', fontSize:'.875em' }}>{tok.slice(1, -1)}</code>);
      } else if (tok.startsWith('**')) {
        parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
      } else if (tok.startsWith('*')) {
        parts.push(<em key={key++}>{tok.slice(1, -1)}</em>);
      } else {
        const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (lm) parts.push(<a key={key++} href={lm[2]} className="sdk-prose-link">{lm[1]}</a>);
        else parts.push(tok);
      }
      last = m.index + tok.length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  };

  // Renders a description string as React elements (paragraphs + fenced code blocks).
  // Returns an array of React elements — no HTML string building, no dangerouslySetInnerHTML.
  const renderMd = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const out = [];
    let i = 0;
    let key = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim();
        const codeLines = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) codeLines.push(lines[i++]);
        i++;
        const codeStr = codeLines.join('\n');
        out.push(
          <div key={key++} className="sdk-code" style={{ marginBottom:'1rem' }}>
            {lang && (
              <div className="sdk-code-header">
                <span className="sdk-code-lang">{lang}</span>
              </div>
            )}
            <pre style={{ margin:0, padding:'.875rem 1rem', fontSize:'.8125rem', lineHeight:1.7, fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace', color:'#e6edf3', overflowX:'auto' }}>
              <code>{codeStr}</code>
            </pre>
          </div>
        );
        continue;
      }
      if (!line.trim()) { i++; continue; }
      const para = [];
      while (i < lines.length && lines[i].trim() && !lines[i].startsWith('```')) para.push(lines[i++]);
      if (para.length) {
        out.push(
          <p key={key++} style={{ margin:'.5rem 0', lineHeight:1.75, color:'var(--text)' }}>
            {renderInline(para.join(' '))}
          </p>
        );
      }
    }
    return out;
  };

  // ── State ─────────────────────────────────────────────────────────────────────

  const [sdkOpen, setSdkOpen]       = useState(false);
  const [verOpen, setVerOpen]       = useState(false);
  const [sdkSearch, setSdkSearch]   = useState('');
  const [activeTab, setActiveTab]   = useState(0);
  const [copiedId, setCopiedId]     = useState(null);
  const [varValues, setVarValues]   = useState(new Map());

  const sidebarRef = useRef(null);

  // Restore sidebar scroll position after same-SDK navigation.
  useEffect(() => {
    const saved = sessionStorage.getItem('sdk-sidebar-scroll');
    if (saved && sidebarRef.current) {
      sidebarRef.current.scrollTop = parseInt(saved, 10);
      sessionStorage.removeItem('sdk-sidebar-scroll');
    }
  }, []);

  // Subscribe to rootStore variable substitution — mirrors AuthCodeBlock's approach.
  // Mintlify's <CodeBlock> is not available in mode: "custom" pages (no MDX component provider).
  useEffect(() => {
    let unsubscribe = null;

    function init() {
      if (!window.autorun || !window.rootStore) return;
      unsubscribe = window.autorun(() => {
        setVarValues(new Map(window.rootStore.variableStore.values));
      });
    }

    if (window.rootStore) {
      init();
    } else {
      window.addEventListener('adu:storeReady', init);
    }

    return () => {
      window.removeEventListener('adu:storeReady', init);
      unsubscribe?.();
    };
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────────

  const sdkOpts = (allSdks || []).map(s => ({ value: s.id, label: s.label }));
  const verOpts = (versions || []).map(v => ({ value: v.version, label: v.version, status: v.status }));

  const filteredSdkOpts = sdkSearch.trim()
    ? sdkOpts.filter(o => o.label.toLowerCase().includes(sdkSearch.toLowerCase()))
    : sdkOpts;

  const tocItems = !page ? [] : [
    page.signature                       && { id: 'signature',   label: 'Signature' },
    page.constructor?.signature          && { id: 'constructor', label: 'Constructor' },
    page.constructor?.parameters?.length && { id: 'ctor-params', label: 'Constructor Parameters' },
    page.parameters?.length              && { id: 'parameters',  label: 'Parameters' },
    page.properties?.length              && { id: 'properties',  label: 'Properties' },
    page.members?.length                 && { id: 'members',     label: 'Members' },
    page.returns?.type                   && { id: 'returns',     label: 'Returns' },
    page.throws?.length                  && { id: 'throws',      label: 'Throws' },
    page.examples?.length                && { id: 'example',     label: 'Example' },
  ].filter(Boolean);

  // ── Variable substitution (ported from AuthCodeBlock) ────────────────────────

  const applyVars = (code, maskSecret) => {
    if (!varValues.size) return code;
    let result = code;
    for (const [key, value] of varValues.entries()) {
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
      const display = (maskSecret && key === '{yourClientSecret}' && value !== '{yourClientSecret}')
        ? value.substring(0, 3) + '*****MASKED*****'
        : value;
      result = result.replace(new RegExp(escaped, 'g'), display);
    }
    return result;
  };

  // ── Handlers ──────────────────────────────────────────────────────────────────

  const goSdk = (id) => {
    const t = (allSdks || []).find(s => s.id === id);
    if (t) window.location.href = `/docs/libraries/${t.id}/${t.version}/${t.landingPage}`;
  };
  const goVer = (ver) => {
    const t = (versions || []).find(v => v.version === ver);
    if (t) window.location.href = `/docs/libraries/${sdk}/${t.version}/${t.landingPage}`;
  };
  const copy = (code, id) => {
    navigator.clipboard.writeText(applyVars(code, false)).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const closeSdkDropdown = () => { setSdkOpen(false); setSdkSearch(''); };

  // ── Sub-renderers ─────────────────────────────────────────────────────────────

  const CheckIcon   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>;
  const CopyIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
  const ChevronIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0, opacity:0.5 }}><path d="M6 9l6 6 6-6"/></svg>;

  // ── Safe syntax highlighting (returns React elements, no HTML strings) ─────────
  // Position-based tokenizer: collects all regex matches across the code string,
  // sorts by start position, resolves overlaps by first-match wins, then builds
  // a flat [{text, color}] token array. React renders each token as a <span> —
  // text nodes are auto-escaped by React, eliminating any XSS vector.

  const tokenize = (code, lang) => {
    const processed = applyVars(code, true);

    const KW   = '#ff7b72';
    const TYPE = '#ffa657';
    const STR  = '#a5d6ff';
    const CMT  = '#8b949e';
    const NUM  = '#79c0ff';
    const FN   = '#d2a8ff';

    const isTs  = /^(ts|tsx|typescript)$/i.test(lang);
    const isJs  = /^(js|jsx|javascript)$/i.test(lang);
    const isGo  = /^go$/i.test(lang);
    const isPy  = /^(py|python)$/i.test(lang);

    if (!isTs && !isJs && !isGo && !isPy) {
      return [{ text: processed, color: null }];
    }

    const rules = [
      { re: /\/\/[^\n]*/g,                                                                           color: CMT },
      { re: /\/\*[\s\S]*?\*\//g,                                                                    color: CMT },
      { re: /#[^\n]*/g,                                                                              color: CMT },
      { re: /`[^`]*`|'[^'\\]*(?:\\.[^'\\]*)*'|"[^"\\]*(?:\\.[^"\\]*)*"/g,                          color: STR },
      { re: /\b\d+(?:\.\d+)?\b/g,                                                                   color: NUM },
      { re: /\b(?:const|let|var|function|class|interface|type|enum|import|export|from|return|if|else|for|while|new|this|async|await|extends|implements|readonly|public|private|protected|static|override|abstract|default|typeof|instanceof|keyof|in|of|package|func|go|defer|chan|select|map|struct|nil|true|false|None|def|with|as|pass|raise|yield|lambda|and|or|not|is|del|global|nonlocal|try|except|finally|break|continue)\b/g, color: KW },
      { re: /\b(?:string|number|boolean|void|any|never|unknown|object|symbol|bigint|undefined|null|Promise|Array|Record|Partial|Required|Readonly|Pick|Omit|Exclude|Extract|NonNullable|ReturnType|InstanceType|int|float|str|bool|bytes|list|dict|tuple|set|Optional|Union|List|Dict|Tuple|Set)\b/g, color: TYPE },
      { re: /\b[A-Za-z_$][A-Za-z0-9_$]*(?=\s*\()/g,                                               color: FN },
    ];

    // Collect all match positions
    const spans = [];
    for (const { re, color } of rules) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(processed)) !== null) {
        spans.push({ start: m.index, end: m.index + m[0].length, color });
      }
    }

    // Sort by start; for ties prefer the rule that appears first (already ordered)
    spans.sort((a, b) => a.start - b.start || a.end - b.end);

    // Build non-overlapping token list
    const tokens = [];
    let pos = 0;
    for (const span of spans) {
      if (span.start < pos) continue; // overlaps a prior span — skip
      if (span.start > pos) tokens.push({ text: processed.slice(pos, span.start), color: null });
      tokens.push({ text: processed.slice(span.start, span.end), color: span.color });
      pos = span.end;
    }
    if (pos < processed.length) tokens.push({ text: processed.slice(pos), color: null });

    return tokens;
  };

  // Renders a tokenized code string as React spans (safe — no dangerouslySetInnerHTML)
  const codeTokens = (code, lang) =>
    tokenize(code, lang).map((tok, i) =>
      tok.color
        ? <span key={i} style={{ color: tok.color }}>{tok.text}</span>
        : tok.text
    );

  const sdkDropdown = () => {
    const current = sdkOpts.find(o => o.value === sdk);
    return (
      <div style={{ position: 'relative' }}>
        <button className="sdk-select" onClick={() => { setSdkOpen(p => !p); setSdkSearch(''); }}>
          <span style={{ display:'flex', alignItems:'center', gap:7, overflow:'hidden' }}>
            {sdkIcon(sdk)}
            <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{current?.label ?? sdk}</span>
          </span>
          <ChevronIcon />
        </button>
        {sdkOpen && (
          <>
            <div style={{ position:'fixed', inset:0, zIndex:40 }} onClick={closeSdkDropdown} />
            <div className="sdk-select-menu">
              <input
                className="sdk-select-search"
                placeholder="Search SDKs…"
                value={sdkSearch}
                onChange={e => setSdkSearch(e.target.value)}
                autoFocus
              />
              {filteredSdkOpts.length === 0 && (
                <div className="sdk-select-empty">No results</div>
              )}
              {filteredSdkOpts.map(opt => (
                <button
                  key={opt.value}
                  className={`sdk-select-opt${opt.value === sdk ? ' sdk-select-opt--active' : ''}`}
                  onClick={() => { goSdk(opt.value); closeSdkDropdown(); }}
                >
                  {sdkIcon(opt.value)}
                  <span className="sdk-select-opt-label">{opt.label}</span>
                  {opt.value === sdk && (
                    <span className="sdk-select-opt-check">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const verDropdown = () => {
    const current = verOpts.find(o => o.value === version);
    return (
      <div style={{ position: 'relative' }}>
        <button className="sdk-select" onClick={() => setVerOpen(p => !p)}>
          <span style={{ display:'flex', alignItems:'center', gap:6, overflow:'hidden' }}>
            <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{current?.label ?? version}</span>
            {current?.status && current.status !== 'active' && verBadge(current.status)}
          </span>
          <ChevronIcon />
        </button>
        {verOpen && (
          <>
            <div style={{ position:'fixed', inset:0, zIndex:40 }} onClick={() => setVerOpen(false)} />
            <div className="sdk-select-menu">
              {verOpts.map(opt => (
                <button
                  key={opt.value}
                  className={`sdk-select-opt${opt.value === version ? ' sdk-select-opt--active' : ''}`}
                  onClick={() => { goVer(opt.value); setVerOpen(false); }}
                >
                  <span className="sdk-select-opt-label">
                    {opt.label}
                    {opt.status && opt.status !== 'active' && (
                      <>{' '}{verBadge(opt.status)}</>
                    )}
                  </span>
                  {opt.value === version && (
                    <span className="sdk-select-opt-check">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const sectionH2 = (text, id) => (
    <h2 id={id} style={{ fontSize:'1rem', fontWeight:600, letterSpacing:'-0.02em', color:'var(--text)', marginTop:'2rem', marginBottom:'0.75rem', fontFamily:"Aeonik,ui-sans-serif,system-ui,sans-serif" }}>
      {text}
    </h2>
  );

  // Code block with Mintlify-style header bar: lang label left, copy button right.
  // No absolute positioning — both elements share a flex row in the header.
  const codeBlock = (code, lang, id) => (
    <div className="sdk-code">
      <div className="sdk-code-header">
        <span className="sdk-code-lang">{lang || ''}</span>
        <button
          className={`sdk-code-copy${copiedId === id ? ' sdk-code-copy--done' : ''}`}
          onClick={() => copy(code, id)}
          title="Copy"
        >
          {copiedId === id ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <pre style={{ margin:0, padding:'.875rem 1rem', fontSize:'.8125rem', lineHeight:1.7, fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace', color:'#e6edf3', overflowX:'auto' }}>
        <code>{codeTokens(code, lang)}</code>
      </pre>
    </div>
  );

  const paramList = (params) => (
    <div style={{ marginBottom: '1.5rem' }}>
      {params.map((p, i) => (
        <div key={i} style={{ padding:'0.75rem 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
          <div style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:'0.5rem', marginBottom: p.description ? '0.25rem' : 0 }}>
            <code style={{ fontFamily:'ui-monospace,monospace', fontSize:'0.875rem', fontWeight:600, color:'var(--text)' }}>{p.name}</code>
            <span style={{ fontFamily:'ui-monospace,monospace', fontSize:'0.8125rem', color:'var(--muted)' }}>{p.type}</span>
            {!p.optional && <span style={{ fontSize:'0.6875rem', fontWeight:600, color:'#f87171', background:'rgba(248,113,113,0.1)', borderRadius:'3px', padding:'1px 5px' }}>required</span>}
          </div>
          {p.description && <p style={{ margin:0, fontSize:'0.875rem', lineHeight:1.6, color:'var(--muted)' }}>{p.description.split('\n')[0]}</p>}
        </div>
      ))}
    </div>
  );

  // ── Page content ──────────────────────────────────────────────────────────────

  const pageContent = () => {
    if (!page) return null;
    const examples = page.examples || [];
    return (
      <div>
        {page.description && (
          <div style={{ fontSize:'1rem', lineHeight:1.75, marginBottom:'1.5rem', color:'var(--text)' }}>
            {renderMd(page.description)}
          </div>
        )}

        {page.signature && <>{sectionH2('Signature', 'signature')}{codeBlock(page.signature, null, 'sig')}</>}

        {page.constructor?.signature && (
          <>
            {sectionH2('Constructor', 'constructor')}
            {codeBlock(page.constructor.signature, null, 'ctor')}
            {page.constructor.parameters?.length > 0 && <>{sectionH2('Constructor Parameters', 'ctor-params')}{paramList(page.constructor.parameters)}</>}
          </>
        )}

        {page.parameters?.length > 0  && <>{sectionH2('Parameters', 'parameters')}{paramList(page.parameters)}</>}

        {page.properties?.length > 0 && (
          <>
            {sectionH2('Properties', 'properties')}
            <div style={{ border:'1px solid var(--border)', borderRadius:'8px', overflow:'hidden', marginBottom:'1.5rem' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.875rem' }}>
                <thead>
                  <tr>
                    {['Property', 'Type', 'Description'].map(col => (
                      <th key={col} style={{ padding:'0.5rem 0.75rem', textAlign:'left', fontWeight:500, fontSize:'0.8125rem', color:'var(--muted)', borderBottom:'1px solid var(--border)', fontFamily:'inherit' }}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.properties.map((p, i) => (
                    <tr key={i} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding:'0.5rem 0.75rem', fontFamily:'ui-monospace,monospace', fontSize:'0.8125rem', fontWeight:500, color:'var(--text)' }}>{p.name}</td>
                      <td style={{ padding:'0.5rem 0.75rem', fontFamily:'ui-monospace,monospace', fontSize:'0.8125rem', color:'var(--muted)' }}>{p.type}</td>
                      <td style={{ padding:'0.5rem 0.75rem', fontSize:'0.875rem', color:'var(--muted)' }}>{(p.description || '').split('\n')[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {page.returns?.type && (
          <>
            {sectionH2('Returns', 'returns')}
            <p style={{ fontSize:'0.9375rem', lineHeight:1.7, marginBottom:'1.5rem', color:'var(--text)' }}>
              <code style={{ fontFamily:'ui-monospace,monospace', fontSize:'0.875rem', color:'var(--text)' }}>{page.returns.type}</code>
              {page.returns.description && <span style={{ color:'var(--muted)' }}> {page.returns.description}</span>}
            </p>
          </>
        )}

        {page.throws?.length > 0 && <>{sectionH2('Throws', 'throws')}{paramList(page.throws)}</>}

        {examples.length > 0 && (
          <div id="example">
            {sectionH2(examples.length === 1 ? 'Example' : 'Examples', null)}
            {examples.length === 1
              ? codeBlock(examples[0].code, examples[0].language, 'ex-0')
              : (
                <div className="sdk-code" style={{ marginBottom:'1.5rem' }}>
                  <div style={{ display:'flex', borderBottom:'1px solid #30363d', alignItems:'center', background:'#161b22' }}>
                    {examples.map((ex, i) => (
                      <button key={i} onClick={() => setActiveTab(i)} style={{
                        padding:'0.5rem 1rem', fontSize:'0.8125rem', background:'none', border:'none',
                        cursor:'pointer', fontFamily:'inherit',
                        fontWeight: i === activeTab ? 500 : 400,
                        color: i === activeTab ? '#e6edf3' : '#7d8590',
                        borderBottom: `2px solid ${i === activeTab ? '#58a6ff' : 'transparent'}`,
                      }}>
                        {ex.title || ex.language}
                      </button>
                    ))}
                    <button
                      onClick={() => copy(examples[activeTab].code, 'ex-tab')}
                      className={`sdk-code-copy${copiedId === 'ex-tab' ? ' sdk-code-copy--done' : ''}`}
                      style={{ marginLeft:'auto', marginRight:'8px' }}
                    >
                      {copiedId === 'ex-tab' ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                  <pre style={{ margin:0, padding:'.875rem 1rem', fontSize:'.8125rem', lineHeight:1.7, fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace', color:'#e6edf3', overflowX:'auto' }}>
                    <code>{codeTokens(examples[activeTab]?.code ?? '', examples[activeTab]?.language)}</code>
                  </pre>
                </div>
              )
            }
          </div>
        )}
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────

  const sidebarContent = (
    <>
      <div style={{ padding:'0 1rem 1.25rem' }}>
        <a href="/docs/libraries" className="sdk-back no_external_icon">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          SDK Libraries
        </a>
      </div>

      {sdkOpts.length > 1 && (
        <div style={{ padding:'0 1rem 0.625rem' }}>
          <p style={{ margin:'0 0 0.375rem', fontSize:'0.75rem', fontWeight:600, color:'var(--muted)', fontFamily:'inherit' }}>SDK</p>
          {sdkDropdown()}
        </div>
      )}

      {verOpts.length > 0 && (
        <div style={{ padding:'0 1rem 1.25rem' }}>
          <p style={{ margin:'0 0 0.375rem', fontSize:'0.75rem', fontWeight:600, color:'var(--muted)', fontFamily:'inherit' }}>Version</p>
          {verDropdown()}
        </div>
      )}

      <div className="sdk-divider" />

      {(groups || []).map((group, i) => (
        <div key={i}>
          {i > 0 && <div className="sdk-divider" />}
          <p style={{ margin:'0', padding:'0.25rem 1rem 0.125rem', fontSize:'0.75rem', fontWeight:600, color:'var(--muted)', fontFamily:'inherit' }}>
            {group.section}
          </p>
          <ul style={{ listStyle:'none', margin:'0 0 0.25rem', padding:0 }}>
            {(group.items || []).map(pg => (
              <li key={pg.id}>
                <a
                  href={`/docs/libraries/${sdk}/${version}/${pg.id}`}
                  className={`sdk-nav-link no_external_icon${pg.id === currentPage ? ' sdk-nav-link--active' : ''}`}
                  onClick={() => { if (sidebarRef.current) sessionStorage.setItem('sdk-sidebar-scroll', sidebarRef.current.scrollTop); }}
                >
                  <span className="sdk-nav-link-title">{pg.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );

  return (
    <>
      <style>{SDK_CSS}</style>
      {/* font-family explicit: mode:custom skips Mintlify's prose wrapper so
          body font doesn't inherit without this. */}
      <div className="sdk-layout" style={{ isolation:'isolate', fontFamily:"ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif", paddingLeft:'max(1.5rem, env(safe-area-inset-left))' }}>

        {/* Left sidebar — visible on tablet/desktop, hidden on mobile
            (Mintlify's own topbar hamburger handles mobile navigation) */}
        <aside
          ref={sidebarRef}
          className="sdk-sidebar"
          style={{ width:'240px', flexShrink:0, height:'100%', overflowY:'auto', overflowX:'hidden', padding:'1.5rem 0 2rem', background:'var(--bg)', borderRight:'1px solid var(--border)' }}
        >
          {sidebarContent}
        </aside>

        {/* Content region — article (720px) + padding (~80px) + TOC (224px) + buffer = ~1100px.
            max-width keeps article and TOC coupled at wide viewports (e.g. 1920px). */}
        <div className="sdk-content-region">

          {/* Main article */}
          <main className="sdk-main" style={{ flex:1, minWidth:0, height:'100%', overflowY:'auto', overflowX:'hidden', padding:'2rem 2.5rem 4rem' }}>

            <div style={{ maxWidth:'720px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                <h1 style={{ fontSize:'2rem', fontWeight:700, lineHeight:1.2, letterSpacing:'-0.02em', margin:0, color:'var(--text)', fontFamily:"Aeonik,ui-sans-serif,system-ui,sans-serif" }}>
                  {title}
                </h1>
                {page?.kind && kindBadge(page.kind)}
              </div>
              {pageContent()}
            </div>
          </main>

          {/* On this page — hidden below 1280px via CSS */}
          {tocItems.length > 0 && (
            <nav className="sdk-toc" style={{ width:'224px', flexShrink:0, height:'100%', overflowY:'auto', overflowX:'hidden', padding:'2.25rem 1rem 2rem 1.5rem', borderLeft:'1px solid var(--border)' }}>
              <p style={{ margin:'0 0 0.75rem', fontSize:'0.6875rem', fontWeight:600, letterSpacing:'0.04em', textTransform:'uppercase', color:'var(--muted)' }}>
                On this page
              </p>
              <ul style={{ listStyle:'none', padding:0, margin:0 }}>
                {tocItems.map(item => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="sdk-toc-link no_external_icon">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

        </div>
      </div>
    </>
  );
};
