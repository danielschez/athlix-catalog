export default function Header() {
  return (
    <header className="border-b border-neutral-800">
      <div className="container header">
        <img src="/logo.avif" alt="Grillo logo" className="logo" />

        <nav className="nav">
          <a href="#">Calzado</a>
          <a href="#">Ropa</a>
          <a href="#">Otros</a>
        </nav>
      </div>
    </header>
  );
}
