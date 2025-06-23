"use client"
import axios from 'axios';
import { useRouter } from "next/navigation";
import React, { useEffect } from 'react'

export default function page() {
    const router = useRouter();
    const SPRING_API = process.env.NEXT_PUBLIC_SPRING_API || "/";
    const saveJwtToken = async() => {
        console.log(SPRING_API+"/api/user")
            const res= await axios.get(SPRING_API+"/api/user", {
                withCredentials : true
            });

            console.log(res.headers['authorization'])
            sessionStorage.setItem("jwtToken",res.headers['authorization'])
        }
    useEffect(()=>{
        saveJwtToken(); 
        router.push("/")
    },[])
    
  return (
    <></>
  )
}
