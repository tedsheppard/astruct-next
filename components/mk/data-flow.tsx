// Where the data goes: stored in Sydney, model requests to OpenAI in the US,
// nothing sent until a person presses Send. Used on the landing and /security.

export function DataFlow() {
  return (
    <div className="df" role="img" aria-label="Your documents, mail and drafts are stored in Sydney. Model requests go to OpenAI in the United States and are not used for training. A letter or email leaves only when a person on your team presses Send.">
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
        <span className="df-k">Only when</span>
        <b>A person presses Send</b>
      </div>
      <span className="df-arrow df-arrow-2" aria-hidden="true" />
      <div className="df-node df-out">
        <span className="df-k">Then</span>
        <b>The letter or email leaves</b>
      </div>
    </div>
  )
}
