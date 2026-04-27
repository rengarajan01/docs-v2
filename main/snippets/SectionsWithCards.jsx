export const SectionsWithCards = ({ sections, title, description }) => {
  const [query, setQuery] = useState("");

  const filteredSections = sections
    .map((s) => ({
      ...s,
      items: s.items.filter((it) => it.name.toLowerCase().includes(query.toLowerCase())),
    }))
    .filter((s) => s.items.length > 0);

  const getLink = (item, label) => item.links?.find((l) => l.label?.toLowerCase() === label.toLowerCase());

  const linkStyle = {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    fontSize: '13px', fontWeight: 500, textDecoration: 'none',
    color: 'inherit', border: 'none', borderBottom: 'none',
    padding: '4px 8px', borderRadius: '6px',
    transition: 'background 0.15s',
    cursor: 'pointer',
  };

  const Card = ({ item }) => {
    const github = getLink(item, "github");
    const sample = getLink(item, "sample app");
    const quickstart = getLink(item, "quickstart");
    const docs = getLink(item, "documentation");
    const reference = getLink(item, "reference");
    const getStarted = getLink(item, "get started");

    const title = item?.name ?? "";
    const subtext = item?.subtext ?? "";
    const badge = item?.badge ?? "";
    const date = item?.date ?? "";

    const tertiary = quickstart || docs || getStarted;
    const tertiaryLabel = quickstart ? "Quickstart" : docs ? "Documentation" : getStarted ? "Get started" : "";

    // Card click goes to: reference > quickstart/docs > github
    const cardHref = (reference || tertiary || github)?.url;

    // Footer shows secondary links only (reference is handled by card click)
    const footerLinks = [
      github && { href: github.url, icon: "github", label: "Github", external: true },
      sample && { href: sample.url, icon: "download", label: "Sample App", external: true },
      tertiary && { href: tertiary.url, icon: "play", label: tertiaryLabel, external: false },
    ].filter(Boolean);

    return (
      <article
        className="libraries_card rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow border-gray-200 dark:border-gray-800 dark:bg-black"
        style={{ overflow: 'hidden' }}
      >
        <a
          href={cardHref}
          className="no_external_icon"
          style={{ display: 'block', textDecoration: 'none', color: 'inherit', cursor: cardHref ? 'pointer' : 'default' }}
        >
          <div className="px-5 md:px-6 pt-5 md:pt-6 pb-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                {item?.logo && (() => {
                  const isUrl = /^https?:\/\//i.test(item.logo);
                  const lightSrc = isUrl ? item.logo : `/docs/images/icons/light/${item.logo}`;
                  const darkSrc  = isUrl ? item.logo : `/docs/images/icons/dark/${item.logo}`;
                  const imgClass = `!my-0 w-10 h-10 object-contain shrink-0${isUrl ? ' mint-filter mint-grayscale' : ''}`;
                  return (
                    <>
                      <img noZoom src={lightSrc} alt={title} className={`${imgClass} mint-block dark:mint-hidden`} />
                      <img noZoom src={darkSrc}  alt={title} className={`${imgClass} mint-hidden dark:mint-block`} />
                    </>
                  );
                })()}
                <div className="min-w-0">
                  <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate !my-0">
                    {title}
                  </h4>
                  {!!subtext && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{subtext}</p>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {!!badge && (
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border border-emerald-700 text-emerald-700 bg-emerald-200 dark:border-emerald-400 dark:text-emerald-300 dark:bg-emerald-900/30">
                    {badge}
                  </span>
                )}
                {!!date && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">on {date.replace(/^on\s+/i, "")}</span>
                )}
              </div>
            </div>
          </div>
        </a>

        {footerLinks.length > 0 && (
          <>
            <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />
            <div className="px-5 md:px-6 py-3">
              <div className="flex items-center justify-between w-full">
                {footerLinks.map(({ href, icon, label, external }) => (
                  <a
                    key={label}
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="no_external_icon !text-black dark:!text-white hover:!bg-gray-100 dark:hover:!bg-gray-800"
                    style={{ ...linkStyle, borderBottom: 'none' }}
                  >
                    <Icon icon={icon} style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                    <span style={{ lineHeight: 1 }}>{label}</span>
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </article>
    );
  };

  return (
    <main style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '3rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '900px' }}>
        {(title || description) && (
          <div style={{ marginBottom: '2.5rem' }}>
            {title && (
              <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', marginBottom: '0.75rem', lineHeight: 1.25, marginTop: 0 }}>
                {title}
              </h1>
            )}
            {description && (
              <p style={{ fontSize: '1.0625rem', color: '#6b7280', lineHeight: 1.65, margin: 0 }}>
                {description}
              </p>
            )}
          </div>
        )}
        <form role="search" autoComplete="on" className="mb-10">
          <div style={{ width: '100%' }}>
            <div
              className="
                relative flex items-center
                border bg-white text-gray-900
                hover:border-gray-400
                focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500
                dark:bg-black dark:text-gray-100
                dark:border-gray-700 dark:hover:border-gray-600
                transition-colors
              "
              aria-label="Search for your technology"
            >
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-500 dark:text-gray-400"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                id="search-input-control"
                type="text"
                placeholder="Search libraries..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="
                  w-full border-0 bg-transparent pl-10 pr-10 py-2.5
                  placeholder:text-gray-400 focus:outline-none text-sm
                  dark:placeholder:text-gray-500
                "
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="
                    absolute right-2 top-1/2 -translate-y-1/2
                    inline-flex items-center rounded-md px-2 py-1 text-xs
                    text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200
                    dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700
                    transition-colors
                  "
                  aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </form>

        {filteredSections.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No results for “{query}”.</p>
        ) : (
          filteredSections.map((section) => (
            <section key={section.id} id={section.id} className="mb-16">
              <h3 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">{section.title}</h3>
              <p className="mb-8 text-gray-600 dark:text-gray-400">{section.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {section.items.map((it, idx) => (
                  <Card key={idx} item={it} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </main>
  );
};

export const LibrariesCards = ({ cards }) => {
  const getLink = (item, label) => item.links?.find((l) => l.label?.toLowerCase() === label.toLowerCase());

  const Card = ({ item }) => {
    const github = getLink(item, "github");
    const sample = getLink(item, "sample app");
    const quickstart = getLink(item, "quickstart");
    const docs = getLink(item, "Get started");

    const title = item?.name ?? "";
    const subtext = item?.subtext ?? "";
    const badge = item?.badge ?? "";
    const date = item?.date ?? ""; // plain string like "Jan 16, 2024"

    const tertiary = quickstart || docs;
    const tertiaryLabel = quickstart ? "Quickstart" : docs ? "Get started" : "";

    return (
      <article
        className="
          libraries_card
        rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow
        border-gray-200 dark:border-gray-800 dark:bg-black
      "
      >
        <div className="px-5 md:px-6 pt-5 md:pt-6 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {item?.logo && (
                <img noZoom src={item.logo} alt={title} className="!my-0 w-10 h-10 object-contain shrink-0" />
              )}

              <div className="min-w-0">
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate !my-0">
                  {title}
                </h4>
                {!!subtext && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{subtext}</p>}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              {!!badge && (
                <span
                  className="
                    inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                    border border-emerald-700 text-emerald-700 bg-emerald-200
                    dark:border-emerald-400 dark:text-emerald-300 dark:bg-emerald-900/30
                  "
                >
                  {badge}
                </span>
              )}

              {!!date && (
                <span className="text-sm text-gray-500 dark:text-gray-400">on {date.replace(/^on\s+/i, "")}</span>
              )}
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gray-200 dark:bg-gray-800" />

        <div className="px-5 md:px-6 py-4">
          <div className="libraries_cards flex items-center justify-between w-full">
            {github && (
              <a
                href={github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  no_external_icon inline-flex items-center gap-2 text-sm font-medium
                  !text-black dark:!text-white
                  !no-underline !border-0
                  transition-colors duration-200
                  hover:!text-neutral-700 dark:hover:!text-neutral-200
                "
                style={{ borderBottom: "none !important" }}
              >
                <Icon icon="github" className="w-4 h-4 shrink-0" />
                <span className="leading-none">Github</span>
              </a>
            )}

            {sample && (
              <a
                href={sample.url}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  no_external_icon inline-flex items-center gap-2 text-sm font-medium
                  !text-black dark:!text-white
                  !no-underline !border-0
                  transition-colors duration-200
                  hover:!text-neutral-700 dark:hover:!text-neutral-200
                "
                style={{ borderBottom: "none !important" }}
              >
                <Icon icon="download" className="w-4 h-4 shrink-0" />
                <span className="leading-none">Sample App</span>
              </a>
            )}

            {tertiary && (
              <a
                href={tertiary.url}
                className="
                  no_external_icon inline-flex items-center gap-2 text-sm font-medium
                  !text-black dark:!text-white
                  !no-underline !border-0
                  transition-colors duration-200
                  hover:!text-neutral-700 dark:hover:!text-neutral-200
                "
                style={{ borderBottom: "none !important" }}
              >
                {tertiaryLabel === "Quickstart" ? (
                  <Icon icon="play" className="w-4 h-4 shrink-0" />
                ) : (
                  <Icon icon="file-lines" className="w-4 h-4 shrink-0" />
                )}
                <span className="leading-none">{tertiaryLabel}</span>
              </a>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {cards.map((it, idx) => (
        <Card key={idx} item={it} />
      ))}
    </div>
  );
};

export const SectionCard = ({ item }) => {
  if (!item) return null;
  const getLink = (item, label) => item.links?.find((l) => l.label?.toLowerCase() === label.toLowerCase());
  const github = getLink(item, "github");
  const sample = getLink(item, "sample app");
  const quickstart = getLink(item, "quickstart");
  const docs = getLink(item, "Get started");
  const reference = getLink(item, "reference");

  const title = item?.name ?? "";
  const subtext = item?.subtext ?? "";
  const badge = item?.badge ?? "";
  const date = item?.date ?? "";

  const isHttpsLogo = typeof item?.logo === "string" && /^https:\/\//i.test(item.logo);

  const src = isHttpsLogo ? item.logo : `/docs/images/icons/light/${item?.logo}`;
  const srcDark = isHttpsLogo ? item.logo : `/docs/images/icons/dark/${item?.logo}`;

  // Add grayscale class only if https
  const imgClass = "!my-0 w-8 h-8 object-contain shrink-0 " + (isHttpsLogo ? "mint-filter mint-grayscale" : "");

  const tertiary = quickstart || docs;
  const tertiaryLabel = quickstart ? "Quickstart" : docs ? "Get started" : "";

  return (
    <article
      className="
      libraries_card mb-[16px]
      rounded-xl border bg-white shadow-sm hover:shadow-md transition-shadow
      border-gray-200 dark:border-gray-800 dark:bg-black
    "
    >
      <div className="px-4 md:px-5 pt-4 md:pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 min-w-0">
            {item?.logo && (
              <>
                <img noZoom src={src} alt={title} className={`${imgClass} mint-block dark:mint-hidden`} />
                <img noZoom src={srcDark} alt={title} className={`${imgClass} mint-hidden dark:mint-block`} />
              </>
            )}

            <div className="min-w-0">
              <h4 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white truncate !m-0 leading-snug">
                {title}
              </h4>
              {!!subtext && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate !m-0 leading-tight">{subtext}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-0.5 shrink-0">
            {!!badge && (
              <span
                className="
                  inline-flex items-center rounded-full px-1.5 py-[0.5px] text-[10px] font-medium
                  border border-emerald-700 text-emerald-700 bg-emerald-200
                  dark:border-emerald-400 dark:text-emerald-300 dark:bg-emerald-900/30
                "
              >
                {badge}
              </span>
            )}
            {!!date && (
              <span className="mr-[5px] text-[10px] text-gray-500 dark:text-gray-400">
                on {date.replace(/^on\s+/i, "")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="h-px mx-3 bg-gray-200 dark:bg-gray-800" />

      <div className="px-4 md:px-5 py-3">
        <div className="libraries_cards flex items-center justify-between w-full gap-3">
          {github && (
            <a
              href={github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                no_external_icon inline-flex items-center gap-1.5 text-xs font-medium
                !text-black dark:!text-white
                !no-underline !border-0
                transition-colors duration-200
                hover:!text-neutral-700 dark:hover:!text-neutral-200
              "
              style={{ borderBottom: "none !important" }}
            >
              <Icon icon="github" className="w-3 h-3 shrink-0" />
              <span className="leading-none">Github</span>
            </a>
          )}

          {sample && (
            <a
              href={sample.url}
              target="_blank"
              rel="noopener noreferrer"
              className="
                no_external_icon inline-flex items-center gap-1.5 text-xs font-medium
                !text-black dark:!text-white
                !no-underline !border-0
                transition-colors duration-200
                hover:!text-neutral-700 dark:hover:!text-neutral-200
              "
              style={{ borderBottom: "none !important" }}
            >
              <Icon icon="download" className="w-3 h-3 shrink-0" />
              <span className="leading-none">Sample App</span>
            </a>
          )}

          {tertiary && (
            <a
              href={tertiary.url}
              className="
                no_external_icon inline-flex items-center gap-1.5 text-xs font-medium
                !text-black dark:!text-white
                !no-underline !border-0
                transition-colors duration-200
                hover:!text-neutral-700 dark:hover:!text-neutral-200
              "
              style={{ borderBottom: "none !important" }}
            >
              {tertiaryLabel === "Quickstart" ? (
                <Icon icon="play" className="w-3 h-3 shrink-0" />
              ) : (
                <Icon icon="file-lines" className="w-3 h-3 shrink-0" />
              )}
              <span className="leading-none">{tertiaryLabel}</span>
            </a>
          )}

          {reference && (
            <a
              href={reference.url}
              className="
                no_external_icon inline-flex items-center gap-1.5 text-xs font-medium
                !text-black dark:!text-white
                !no-underline !border-0
                transition-colors duration-200
                hover:!text-neutral-700 dark:hover:!text-neutral-200
              "
              style={{ borderBottom: "none !important" }}
            >
              <Icon icon="book" className="w-3 h-3 shrink-0" />
              <span className="leading-none">Reference</span>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
