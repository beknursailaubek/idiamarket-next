import Link from "next/link";
import Image from "next/image";
import RecentlyWatched from "@/components/RecentlyWatched/RecentlyWatched";

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center gap-[20px]">
      <Image className="" src="/images/404_error.gif" width={560} height={420} alt="" />
      <p className="">Упс! Я не нашел такую страницу</p>
      <Link className=" text-sky-500 " href="/">
        На главную страницу
      </Link>

      <RecentlyWatched page="home" />
    </div>
  );
}
