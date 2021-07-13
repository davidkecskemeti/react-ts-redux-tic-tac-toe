import logo from "./../assets/logo.svg";

const Header: React.FC = () => {
  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>Tic Tac Toe</p>
    </header>
  );
};

export default Header;
