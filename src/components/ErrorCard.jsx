function ErrorCard({ message, onClose }) {
  return (
    <div className="error-card">
      <div className="error-card-inner">
        <div className="error-message">{message}</div>
        {onClose && <button className="error-close" onClick={onClose}>×</button>}
      </div>
    </div>
  );
}

export default ErrorCard;
