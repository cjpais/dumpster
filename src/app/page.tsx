import Image from "next/image";
import Link from "next/link";
import UsersPages from "./UsersPages";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 max-w-2xl w-full mx-auto">
      <h1 className="text-4xl mb-4">dumpster.page</h1>
      <div className="flex flex-col text-center max-w-md">
        <p>drag internet garbage onto the canvas</p>
        <p>get a url so you can show ur trash heap off to everyone</p>
        <p>maybe itll compost one day</p>
      </div>
      <div className="flex gap-4 my-4">
        <Link
          href="/create"
          className="text-blue-500 hover:text-blue-600 text-3xl"
        >
          create a dumpster fire
        </Link>
      </div>
      <UsersPages />
      <Link className="text-blue-500 hover:text-blue-600 mt-12" href="/about">
        made for raccoons.
      </Link>
    </div>
  );
}

export const metadata = {
  title: "dumpster page",
  description: "encouraging a raccoon revolution",
};
