import {NextRequest,NextResponse} from "next/server";
export function middleware(req:NextRequest){
 const path=req.nextUrl.pathname;
 if(path.startsWith("/admin")||path.startsWith("/professor")||path.startsWith("/portal")||path.startsWith("/api")){
  const res=NextResponse.next(); res.headers.set("X-Robots-Tag","noindex, nofollow"); return res;
 }
 const res=NextResponse.next(); res.headers.set("X-Content-Type-Options","nosniff"); res.headers.set("Referrer-Policy","strict-origin-when-cross-origin"); res.headers.set("Permissions-Policy","camera=(), microphone=(), geolocation=()"); res.headers.set("X-Frame-Options","DENY"); return res;
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]};
