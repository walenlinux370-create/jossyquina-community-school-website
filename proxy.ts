import {NextRequest,NextResponse} from "next/server";
import {createServerClient} from "@supabase/ssr";
export async function proxy(request:NextRequest){
 let response=NextResponse.next({request});
 const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{
  cookies:{getAll(){return request.cookies.getAll()},setAll(values){values.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});values.forEach(({name,value,options})=>response.cookies.set(name,value,options))}}
 });
 const protectedPath=request.nextUrl.pathname.startsWith("/admin")||request.nextUrl.pathname.startsWith("/professor");
 if(protectedPath){
  const {data}=await supabase.auth.getClaims();
  if(!data?.claims){const url=new URL("/auth",request.url);url.searchParams.set("next",request.nextUrl.pathname);return NextResponse.redirect(url)}
 }
 if(request.nextUrl.pathname.startsWith("/portal") && request.nextUrl.pathname!=="/portal/login" && !request.cookies.get("student_session")){
  return NextResponse.redirect(new URL("/portal/login",request.url));
 }
 response.headers.set("X-Robots-Tag",request.nextUrl.pathname.startsWith("/admin")||request.nextUrl.pathname.startsWith("/professor")||request.nextUrl.pathname.startsWith("/portal")||request.nextUrl.pathname.startsWith("/api")?"noindex, nofollow":"index, follow");
 response.headers.set("X-Content-Type-Options","nosniff");
 response.headers.set("Referrer-Policy","strict-origin-when-cross-origin");
 response.headers.set("Permissions-Policy","camera=(), microphone=(), geolocation=()");
 response.headers.set("X-Frame-Options","DENY");
 return response;
}
export const config={matcher:["/((?!_next/static|_next/image|favicon.ico).*)"]};