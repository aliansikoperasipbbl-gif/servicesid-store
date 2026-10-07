"use client";
import { useState } from "react";
export default function Home() {
  const [user,setUser]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState("");
  async function login(e:any){e.preventDefault();setErr("");const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:user,password:pass})});if(r.ok)location.href="/admin";else setErr("Username atau password salah.");}
  return <main className="shell"><div className="wrap"><div className="login card"><div className="brand">🟩 ServicesId Store</div><h1 className="title">Admin Panel</h1><p className="small">Kelola produk, kategori dan tampilan toko.</p><form onSubmit={login}><input className="input" placeholder="Username" value={user} onChange={e=>setUser(e.target.value)}/><input className="input" placeholder="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)}/>{err&&<p style={{color:"#fca5a5"}}>{err}</p>}<button className="btn" style={{width:"100%"}}>Masuk</button></form></div></div></main>
}
