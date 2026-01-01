function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function MainPage() {
  await sleep(1200);

  return (
    <div>
      <h2>Main Content</h2>
      <p>
        これは、スロットのシミュレートです！<br></br>
        This slot simulates a slower data fetch to show that the sidebar can
        render independently.
      </p>
      <div>
        <strong>Status:</strong> Ready
      </div>
    </div>
  );
}
