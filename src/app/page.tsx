import Image from "next/image";
import Link from "next/link";
import UsersPages from "./UsersPages";

export default function Home() {
  return (
    <div>
      <main>
        <Link href="/create">Create</Link>
        <UsersPages />
      </main>
    </div>
  );
}
