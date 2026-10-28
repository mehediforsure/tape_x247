type AccessPageProps = {
  searchParams?: Promise<{ error?: string }>;
};

export default async function AccessPage({ searchParams }: AccessPageProps) {
  const params = await searchParams;
  const hasError = params?.error === "1";

  return (
    <main className="access-page">
      <div className="access-panel">
        <p className="access-kicker">tape_x247 / private beta</p>
        <h1 className="access-title">Enter the archive.</h1>
        <p className="access-copy">
          This space is currently private. Enter the password to continue.
        </p>
        <form action="/api/access" method="post" className="access-form">
          <label htmlFor="password">Password</label>
          <div className="access-input-row">
            <input id="password" name="password" type="password" autoFocus required />
            <button type="submit">Enter</button>
          </div>
          {hasError && <p className="access-error">That password is not correct.</p>}
        </form>
      </div>
    </main>
  );
}
