import './styles/Zaglushka.css';

const Zaglushka = () => {
  return (
    <div className="zaglushka minimal">
      <div className="grid" />
      <div className="content">
        <h1 className="title">Zaglushka</h1>
        <p className="message">
          <span>Страница заглушка для демонстрации работы</span>
          <span className="highlight">React Router</span>
        </p>
        <div className="line" />
        <button className="back" onClick={() => window.history.back()}>
          <span>←</span> go back
        </button>
      </div>
    </div>
  );
};

export default Zaglushka;