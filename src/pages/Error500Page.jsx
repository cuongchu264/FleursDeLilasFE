import { Link } from 'react-router-dom';

function Error500Page() {
  return (
    <section className="content-panel">
      <div className="panel-header">
        <h2>Server Error</h2>
      </div>

      <div className="panel-body">
        <p>Sorry — something went wrong on the server.</p>
        <p>
          Try again later or <Link to="/">return to dashboard</Link>.
        </p>
      </div>
    </section>
  );
}

export default Error500Page;
