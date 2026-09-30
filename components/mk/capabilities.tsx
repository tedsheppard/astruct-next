// The four capabilities, drawn in HTML and CSS from the demo pack's own facts
// (astruct/launch/demo/story.md and mail/mail.json: Arcline Façades'
// subcontract HV2291-SC-014 with Harrow & Vale Constructions, Kestrel Street
// Mixed-Use, Stage 2). Everyone in it is fictional. Quotes are verbatim from
// the pack and page numbers are the subcontract PDF's own (28 pages): SC 7.1
// on p 20, SC 8.1 on p 21, SC 9(b) on p 22, Annexure Part C note on p 25.
import { IDoc, IMail, ISide } from './icons'

/** Ask: a question answered from the contract and the mail, with the page. */
export function AskFragment() {
  return (
    <div className="ui">
      <div className="ui-card ui-chat">
        <div className="ui-chat-q">
          SI-014 says “no change to the subcontract sum”. Do we still need to give a variation notice, and by when?
        </div>
        <div className="ui-chat-a">
          <p>
            Yes. SC 8.1 applies to any Direction you consider a Variation, including “a Direction stated to involve no
            change to the Subcontract Sum”. SC 9(b) confirms the statement does not relieve you of the notice.
            <sup>1, 2</sup>
          </p>
          <p>
            SI-014 was emailed by Craig Pellow on Fri 25 Sep at 3:12 pm, before 5:00 pm on a Business Day, so it was
            received that day.<sup>3</sup> Five Business Days takes the Variation Notice to <b>Fri 2 Oct, 5:00 pm</b>.
          </p>
          <div className="ui-cites">
            <span className="ui-cite"><i>1</i>Subcontract HV2291-SC-014<b>p 21</b></span>
            <span className="ui-cite"><i>2</i>Subcontract, SC 9(b)<b>p 22</b></span>
            <span className="ui-cite"><i>3</i>Email · SI-014 · Fri 25 Sep</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Search: a Boolean query across the project with page-level results. */
export function SearchFragment() {
  const results = [
    {
      title: 'HV2291-SI-014 Site Instruction',
      meta: 'Site instructions · PDF',
      page: 'p 1',
      snip: <>&hellip;retrofit supplementary fixing plate SFP-16 with 2 additional M16 chemical <mark>anchors</mark> at each <mark>bracket</mark> position (Detail 7B)&hellip;</>,
    },
    {
      title: 'HV2291-TR-0412 Transmittal, A-512 Rev C',
      meta: 'Transmittals · PDF',
      page: 'p 1',
      snip: <>&hellip;FB-220HD <mark>bracket</mark> with 2 additional M16 chemical <mark>anchors</mark> at <mark>slab edge</mark>, L6–L9 and Roof&hellip;</>,
    },
    {
      title: 'SI-014 – Facade brackets L4-L9 to Detail 7/A-512 Rev C',
      meta: 'Email · Craig Pellow · Fri 25 Sep, 3:12 pm',
      page: 'Email',
      snip: <>&hellip;change the facade <mark>bracket</mark> system at <mark>slab edges</mark> L4 to L9 to Detail 7/A-512 <mark>Rev C</mark>&hellip;</>,
    },
  ]
  return (
    <div className="ui">
      <div className="ui-card ui-search">
        <div className="ui-search-bar">
          <ISide.search className="ui-ic" />
          <code className="ui-q">
            <span>bracket*</span> <em>w/5</em> <b>(</b><span>&quot;slab edge&quot;</span> <em>OR</em> <span>anchor*</span><b>)</b> <em>AND</em> <span>&quot;Rev C&quot;</span>
          </code>
        </div>
        <div className="ui-search-sub">
          <span className="ui-seg"><span className="is-on">Boolean</span><span>Plain English</span></span>
          <span className="ui-muted">Kestrel Street, Stage 2 · documents and mail</span>
        </div>
        <div className="ui-results">
          {results.map((r) => (
            <div className="ui-result" key={r.title}>
              <div className="ui-result-head">
                <span className="ui-result-ic">{r.page === 'Email' ? <IMail className="" /> : <IDoc className="" />}</span>
                <span className="ui-result-title">{r.title}</span>
                <span className="ui-page">{r.page}</span>
              </div>
              <div className="ui-result-meta">{r.meta}</div>
              <div className="ui-result-snip">{r.snip}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Draft: the kinds, and the Variation Notice prepared for review. */
export function DraftFragment() {
  const kinds = ['Letter', 'Email', 'Variation notice', 'Notice of delay', 'EOT claim']
  return (
    <div className="ui">
      <div className="ui-kinds" aria-hidden="true">
        {kinds.map((k) => <span key={k} className={`ui-kindchip${k === 'Variation notice' ? ' is-on' : ''}`}>{k}</span>)}
      </div>
      <div className="ui-card ui-doc">
        <div className="ui-doc-page">
          <div className="ui-letterhead"><span>ARCLINE FAÇADES</span><span>ARC-KS2-L-042</span></div>
          <h5>Variation Notice V-06</h5>
          <div className="ui-doc-grid">
            <span>To</span><span>Rebecca Lindqvist, Harrow &amp; Vale Constructions Pty Ltd</span>
            <span>Date</span><span>Tuesday 29 September 2026</span>
            <span>Re</span><span>Site Instruction SI-014, façade brackets L4–L9</span>
          </div>
          <p>Arcline gives notice under Special Condition SC 8.1 that it considers the Direction in SI-014 to be a Variation. Arcline does not agree that SI-014 involves no change to the Subcontract Sum.</p>
          <p>Arcline will give its Variation Particulars under Special Condition SC 8.2 by Monday 19 October 2026.</p>
        </div>
        <div className="ui-doc-bar">
          <span className="ui-review"><IDoc className="" />Prepared for review · Not sent</span>
          <span className="ui-btn">Download .docx</span>
        </div>
      </div>
    </div>
  )
}

/** Watch: the agent reading mail as it arrives, and the deadlines it found. */
export function WatchFragment() {
  return (
    <div className="ui">
      <div className="ui-card ui-watch">
        <div className="ui-watch-head">
          <span className="ui-watch-title"><ISide.mail className="ui-ic" />Mail · Kestrel Street, Stage 2</span>
          <span className="ui-live"><i className="ui-dot" />Watching</span>
        </div>
        <div className="ui-watch-row">
          <div className="ui-watch-mail">
            <b>Rebecca Lindqvist</b><span className="ui-muted">Mon 1:20 pm</span>
            <div className="ui-watch-subj">RE: L6 slab edge handover – revised date</div>
          </div>
          <div className="ui-flag" data-c="amber">
            <span className="ui-flag-k">Possible delay</span>
            <span>L6 slab edge now handed over Tue 6 Oct, not Wed 30 Sep. L5 unit start moves.</span>
          </div>
        </div>
        <div className="ui-watch-row">
          <div className="ui-watch-mail">
            <b>Craig Pellow</b><span className="ui-muted">Fri 3:12 pm</span>
            <div className="ui-watch-subj">SI-014 – Facade brackets L4-L9 to Detail 7/A-512 Rev C</div>
          </div>
          <div className="ui-flag" data-c="rose">
            <span className="ui-flag-k">Direction outside scope</span>
            <span className="ui-cmp">
              <span><small>Scope · Annexure C, p 25</small>FB-150 brackets, 2 × M12 anchors</span>
              <span><small>SI-014</small>FB-220HD brackets, 2 extra M16 anchors</span>
            </span>
          </div>
        </div>
        <div className="ui-watch-row is-quiet">
          <div className="ui-watch-mail">
            <b>Jess Nguyen</b><span className="ui-muted">16 Sep</span>
            <div className="ui-watch-subj">Variation to meeting time – Façade coordination Thu 17 Sep now 1.30 pm</div>
          </div>
          <div className="ui-flag is-none"><span>No action. A meeting time, not the works.</span></div>
        </div>
        <div className="ui-dl">
          <div className="ui-dl-row">
            <span><b>Delay Notice</b><small>SC 7.1 · Subcontract p 20 · aware Wed 23 Sep</small></span>
            <span className="ui-dl-when">Wed 30 Sep, 5:00 pm<span className="ui-tag">Check the clause</span></span>
          </div>
          <div className="ui-dl-row">
            <span><b>Variation Notice</b><small>SC 8.1 · Subcontract p 21 · received Fri 25 Sep</small></span>
            <span className="ui-dl-when">Fri 2 Oct, 5:00 pm<span className="ui-tag">Check the clause</span></span>
          </div>
        </div>
      </div>
    </div>
  )
}
