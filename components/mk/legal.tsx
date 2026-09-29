export type LegalSection = { id: string; h: string; body: React.ReactNode }

export function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: React.ReactNode; sections: LegalSection[] }) {
  return (
    <>
      <section className="mk-page-head">
        <div className="mk-wrap">
          <span className="mk-kicker">Legal</span>
          <h1 className="mk-h2">{title}</h1>
          <p className="mk-fine" style={{ marginTop: 18 }}>Last updated {updated}</p>
        </div>
      </section>
      <div className="mk-wrap">
        <div className="mk-legal">
          <nav aria-label="Contents">
            {sections.map((s) => <a key={s.id} href={`#${s.id}`}>{s.h}</a>)}
          </nav>
          <div className="mk-prose">
            <div style={{ marginBottom: 40 }}>{intro}</div>
            {sections.map((s) => (
              <section key={s.id} id={s.id} style={{ scrollMarginTop: 96 }}>
                <h2>{s.h}</h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
