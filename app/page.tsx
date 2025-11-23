import Image from "next/image";

export default function Home() {
  return (
    <main style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
      <Image
        src="/nextjs-github-pages/vercel.svg"
        alt="Vercel Logo"
        width={100}
        height={24}
        priority
      />
    </main>
  );
}
