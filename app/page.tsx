"use client"
import { apiClient } from "@/lib/api-client";
import { IVideo } from "@/Models/Video";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  // const [videos, setVideos] = useState<IVideo[]>([]);
  // useEffect(() => {
  //   const fetchVideos = async () => {
  //     try {
  //       const data = await apiClient.getVideos();
  //       setVideos(data);
  //     } catch (error) {
  //       console.error("Error fetching videos", error);
  //     }
  //   };

  //   fetchVideos()
  // },[]);
  const router = useRouter();
  const { data: session, status } = useSession();
console.log(session);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);
  return (
    <>
    <h1>Home</h1>
    </>
  )
  
}
