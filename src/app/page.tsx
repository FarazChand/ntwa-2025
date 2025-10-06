import Image from "next/image";

export default function Home() {
  return (
    <main>
      <h1 className="flex text-lg text-primary">Hello world!</h1>
      <h1 className="flex text-lg text-secondary">Hello world!</h1>
      <h1 className="text-lg text-accent">Hello world!</h1>
      <h1 className="text-lg text-background">Hello world!</h1>
      <h1 className="text-lg text-foreground">Hello world!</h1>
      <h1 className="text-lg text-muted">Hello world!</h1>
      <h1 className="text-lg text-border">Hello world!</h1>
      <h1 className="text-lg text-input">Hello world!</h1>
      <h1 className="text-lg text-danger">Hello world!</h1>
    </main>
  );
}
