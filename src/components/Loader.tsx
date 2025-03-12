import '../App.css';

const Loader = ({ text = 'Loading...' }: { text?: string }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <div className="loader"></div>
        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
