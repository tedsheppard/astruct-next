// Where the data goes: stored in Sydney, model requests to OpenAI in the US,
// and Astruct never sends: you send what it drafts. Used on the landing and /security.

export function DataFlow() {
  return (
    <div className="df" role="img" aria-label="Your documents, mail and drafts are stored in Sydney. Model requests go to OpenAI in the United States and are not used for training. Astruct never sends a letter or email. You send what it drafts, from your own mail.">
      <div className="df-node">
        <span className="df-k">Your team</span>
        <b>Documents, mail and drafts</b>
      </div>
      <span className="df-arrow" aria-hidden="true" />
      <div className="df-node is-main">
        <span className="df-k"><i className="df-flag" aria-hidden="true" />Stored</span>
        <b>Sydney, Australia</b>
        <small>Projects, mail, documents, drafts</small>
      </div>
      <span className="df-arrow is-both" aria-hidden="true" />
      <div className="df-node">
        <span className="df-k">Model requests</span>
        <b>OpenAI, United States</b>
        <small>Business API terms · not used for training</small>
      </div>
      <span className="df-down" aria-hidden="true" />
      <div className="df-node df-gate">
        <span className="df-k">Sending</span>
        <b>You, not Astruct</b>
      </div>
      <span className="df-arrow df-arrow-2" aria-hidden="true" />
      <div className="df-node df-out">
        <span className="df-k">From</span>
        <b>Your own mail</b>
      </div>
    </div>
  )
}
