import {NextResponse} from "next/server";
import {randomBytes,createHash} from "node:crypto";
import {createClient} from "@supabase/supabase-js";
import {z} from "zod";
import {serverEnv} from "@/lib/env";
const schema=z.object({identifier:z.string().trim().min(1).max(254),code:z.string().trim().min(1).max(32)});
const GENERIC="Não foi possível iniciar sessão. Verifique os dados ou contacte a secretaria.";
export async function POST(req:Request){
 try{
  const input=schema.parse(await req.json());
  const db=createClient(serverEnv.SUPABASE_URL,serverEnv.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
  const {data,error}=await db.rpc("verify_student_code",{p_registration_number:input.identifier,p_code:input.code});
  if(error||!data) return NextResponse.json({ok:false,message:GENERIC},{status:401});
  const token=randomBytes(32).toString("base64url");
  const tokenHash=createHash("sha256").update(token).digest("hex");
  const {error:sessionError}=await db.from("student_sessions").insert({student_id:data,token_hash:tokenHash,expires_at:new Date(Date.now()+1000*60*30).toISOString()});
  if(sessionError) return NextResponse.json({ok:false,message:GENERIC},{status:401});
  const res=NextResponse.json({ok:true});
  res.cookies.set("student_session",token,{httpOnly:true,secure:true,sameSite:"strict",path:"/",maxAge:60*30});
  return res;
 }catch{return NextResponse.json({ok:false,message:GENERIC},{status:401});}
}