import "./Footer.css"

export const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <h2>UMBRELLA CORPORATION</h2>
      <div>© 1968 UMBRELLA CORPORATION. ALL RIGHT RESERVED. UNHAZARD COMPLIANT</div>
      </div>
      <div>
        <h2>RE Commerce prototype built by Michael Kovacsik</h2>
        <p className="color-primary-light"><a href="https://kovacsikdev.github.io/" target="_blank" rel="noopener noreferrer">kovacsikdev.github.io</a></p>
        <p className="color-primary-light"><a href="mailto:kovacsikdev@gmail.com" target="_blank" rel="noopener noreferrer">kovacsikdev@gmail.com</a></p>
      </div>
    </footer>
  );
};
