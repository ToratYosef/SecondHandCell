export default function LoginPage() {
  return (
    <div className="card" style={{ maxWidth: '480px', margin: '0 auto' }}>
      <h1 className="section-title" style={{ fontSize: '2rem' }}>Login</h1>
      <p style={{ lineHeight: 1.6 }}>
        Authentication uses Firebase Auth. Configure the emulator for local development or supply
        production credentials via environment variables.
      </p>
    </div>
  );
}
