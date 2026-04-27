// Self-contained — no imports. All data passed as props by the generator.

const STATUS_CONFIG = {
  active:     { label: 'Active',     color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0' },
  deprecated: { label: 'Deprecated', color: '#dc2626', bg: '#fee2e2', border: '#fecaca' },
  legacy:     { label: 'Legacy',     color: '#d97706', bg: '#fef3c7', border: '#fde68a' },
  beta:       { label: 'Beta',       color: '#7c3aed', bg: '#ede9fe', border: '#ddd6fe' },
};

// versions: [{ version: string, status: string, landingPage: string }]
export const SdkVersionSwitcher = ({ sdk, version, label, versions }) => {
  if (!versions?.length) return null;

  const currentEntry = versions.find(v => v.version === version);
  const status = currentEntry?.status ?? 'active';
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;
  const showSwitcher = versions.length > 1;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 14px',
      marginBottom: '20px',
      borderRadius: '8px',
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
      flexWrap: 'wrap',
    }}>
      {label && (
        <>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
            {label}
          </span>
          <span style={{ color: '#d1d5db', fontSize: '13px' }}>·</span>
        </>
      )}

      {showSwitcher ? (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {versions.map(({ version: ver, status: st, landingPage }) => {
            const cfg = STATUS_CONFIG[st] ?? STATUS_CONFIG.active;
            const isCurrent = ver === version;
            return (
              <a
                key={ver}
                href={`/docs/libraries/${sdk}/${ver}${landingPage ? `/${landingPage}` : ''}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: isCurrent ? 700 : 500,
                  textDecoration: 'none',
                  border: `1.5px solid ${isCurrent ? cfg.color : '#d1d5db'}`,
                  background: isCurrent ? cfg.bg : '#ffffff',
                  color: isCurrent ? cfg.color : '#6b7280',
                  pointerEvents: isCurrent ? 'none' : 'auto',
                }}
              >
                {ver}
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '1px 5px',
                  borderRadius: '4px',
                  background: isCurrent ? cfg.color : cfg.bg,
                  color: isCurrent ? '#ffffff' : cfg.color,
                  border: `1px solid ${cfg.border}`,
                  letterSpacing: '0.02em',
                  textTransform: 'uppercase',
                }}>
                  {cfg.label}
                </span>
              </a>
            );
          })}
        </div>
      ) : (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
            {version}
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            padding: '2px 7px',
            borderRadius: '4px',
            background: statusCfg.bg,
            color: statusCfg.color,
            border: `1px solid ${statusCfg.border}`,
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
          }}>
            {statusCfg.label}
          </span>
        </span>
      )}
    </div>
  );
};
