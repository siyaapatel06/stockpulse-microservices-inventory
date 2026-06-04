function LandingPage({ onLaunch, onArchitecture }) {
    return (
      <div className="landing">
        <nav className="landing-nav">
          <div className="brand">
            <div className="logo-icon">◆</div>
            <span>StockPulse</span>
          </div>
  
          <div className="nav-links">
            <button onClick={onArchitecture}>Architecture</button>
            <button onClick={onLaunch}>Launch Demo</button>
          </div>
        </nav>
  
        <section className="hero">
          <div className="hero-left">
            <div className="hero-badge">Event-Driven • Dockerized • Load Tested</div>
  
            <h1>
              Inventory intelligence for modern retail teams.
            </h1>
  
            <p>
              StockPulse is a microservices-based inventory command center with
              real-time order events, service health monitoring, JWT security,
              graceful failure handling, and performance proof.
            </p>
  
            <div className="hero-actions">
              <button className="primary-btn" onClick={onLaunch}>
                🚀 Launch Live Demo
              </button>
  
              <button className="secondary-btn" onClick={onArchitecture}>
                View Architecture
              </button>
            </div>
  
            <div className="proof-strip">
              <div>
                <strong>27k</strong>
                <span>requests tested</span>
              </div>
              <div>
                <strong>1340</strong>
                <span>req/sec</span>
              </div>
              <div>
                <strong>36ms</strong>
                <span>avg latency</span>
              </div>
              <div>
                <strong>50</strong>
                <span>concurrent users</span>
              </div>
            </div>
          </div>
  
          <div className="hero-panel">
            <div className="mini-window">
              <div className="window-dots">
                <span></span><span></span><span></span>
              </div>
  
              <h3>Live System Snapshot</h3>
  
              <div className="mini-card green-glow">
                <span>API Gateway</span>
                <strong>UP</strong>
              </div>
  
              <div className="mini-card blue-glow">
                <span>Orders Service</span>
                <strong>UP</strong>
              </div>
  
              <div className="mini-card purple-glow">
                <span>Inventory Service</span>
                <strong>UP</strong>
              </div>
  
              <div className="mini-timeline">
                <p>ORDER_CREATED</p>
                <p>STOCK_RESERVED</p>
                <p>PAYMENT_SIMULATED</p>
                <p>ORDER_CONFIRMED</p>
              </div>
            </div>
          </div>
        </section>
  
        <section className="feature-section">
          <h2>Built like a real SaaS backend</h2>
  
          <div className="feature-grid">
            <Feature title="JWT Security" text="Protected routes with token-based authentication." />
            <Feature title="Microservices" text="Auth, Inventory, Orders, Gateway, and Dashboard." />
            <Feature title="Event Timeline" text="Order flow is captured as business events." />
            <Feature title="Graceful Failure" text="Orders fail safely when Inventory is unavailable." />
            <Feature title="Dockerized" text="Entire system runs with Docker Compose." />
            <Feature title="Performance Proof" text="Load tested with 50 concurrent users." />
          </div>
        </section>
  
        <section className="landing-cta">
          <h2>Ready for evaluator demo mode?</h2>
          <p>
            One click opens the live dashboard where judges can log in, place
            demo orders, inspect service health, and view event-driven behavior.
          </p>
          <button className="primary-btn" onClick={onLaunch}>
            Open StockPulse Dashboard
          </button>
        </section>
      </div>
    );
  }
  
  function Feature({ title, text }) {
    return (
      <div className="feature-card">
        <div className="feature-icon">✦</div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    );
  }
  
  export default LandingPage;