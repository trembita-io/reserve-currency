import Link from "next/link";
import { useRouter } from "next/router";

export default function Navigation() {
  const router = useRouter();

  return (
    <div className="flex justify-end w-full fixed">
      <Link href="/" className={`pr-3 ${router.pathname == "/" && "active"}`}>
        {" "}
        Home{" "}
      </Link>
      <Link
        href="/about"
        className={`pr-3 ${router.pathname == "/about" && "active"}`}
      >
        {" "}
        About{" "}
      </Link>
      <Link href="/data" className={`pr-3 ${router.pathname == "/data" && "active"}`}>
        {" "}
        Data{" "}
      </Link>
      </div>
  );
}
