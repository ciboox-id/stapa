import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type PageProps = {
  params: {
    team: String;
    category: String;
    detail: string;
  };
};

async function getData(params: String) {
  const cookieStore = cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/club/` + params, {
    headers: {
      Authorization: `Bearer ${cookieStore.get("token")?.value}`,
    },
    cache: "no-store",
    next: {
      revalidate: 10,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data = " + res.statusText);
  }
  return res.json();
}
async function getDataPlayer(params: String) {
  const cookieStore = cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/club/p/` + params, {
    headers: {
      Authorization: `Bearer ${cookieStore.get("token")?.value}`,
    },
    cache: "no-store",
    next: {
      revalidate: 10,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data = " + res.statusText);
  }
  return res.json();
}

async function TeamCard({ params: query }: PageProps) {
  let data = await getData(query.team);
  let dataPlayer = await getDataPlayer(query.team);
  const player = dataPlayer.data.players.filter((e: any) => {
    return e.role === "PLAYER" ? e : "";
  });
  const staff = dataPlayer.data.players.filter((e: any) => {
    return e.role !== "PLAYER" ? e : "";
  });
  return (
    <>
      {data.success ? "" : (data = [])}
      <div className=" w-full rounded-lg py-4">
        <div className=" flex  justify-between max-lg:flex-col  items-center ">
          <h1 className="capitalize font-bold opensans text-3xl">{data.data.club_nickname}</h1>
          <Link href={`/main/${query.category}/`} className="bg-[#D00D00] max-lg:mt-4 rounded-lg text-white px-12 py-2">
            Kembali
          </Link>
        </div>

        <div className="card flex max-lg:flex-col  justify-between mt-8 ">
          <div className="flex w-3/4 gap-4">
            <Image
              src={data.data.club_image || "https://www.shutterstock.com/shutterstock/photos/412057294/display_1500/stock-vector-seamless-vector-sports-pattern-sports-random-colorful-balls-icons-412057294.jpg"}
              width={"128"}
              height={"150"}
              alt=""
              className="object-cover rounded-2xl w-[128px] h-auto "
            ></Image>
            <div>
              <h1 className="font-semibold mt-8 text-[#9d9d9d] text-base">sepak bola</h1>
              <h1 className="font-bold capitalize mt-1 text-2xl text-gray-900">{data.data.club_shortname}</h1>
            </div>
          </div>
          <div className="data_tim w-full uppercase grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-8 gap-6 font-semibold">
            <div>
              <label className="text-xs font-bold">nama asli</label>
              <input className=" capitalize bg-white h-10 w-full  p-2 rounded-lg" defaultValue={data.data.club_name} />
            </div>
            <div>
              <label className="text-xs font-bold">tanggal berdiri</label>
              <p className=" capitalize bg-white h-10 w-full  p-2 rounded-lg">{data.data.club_established}</p>
            </div>
            <div>
              <label className="text-xs font-bold">asal club</label>
              <p className=" capitalize bg-white h-10 w-full  p-2 rounded-lg">{data.data.club_origin}</p>
            </div>
            <div>
              <label className="text-xs font-bold">jumlah pemain</label>
              <p className=" capitalize bg-white h-10 w-full  p-2 rounded-lg">{player.length}</p>
            </div>{" "}
            <div>
              <label className="text-xs font-bold">jumlah staf</label>
              <p className=" capitalize bg-white h-10 w-full  p-2 rounded-lg">{staff.length}</p>
            </div>
            <div>
              <label className="text-xs font-bold">jumlah trofi</label>
              <p className=" capitalize bg-white h-10 w-full  p-2 rounded-lg">0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TeamCard;
