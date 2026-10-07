import {NextResponse} from "next/server";
import {z} from "zod";
import {createClient} from "@supabase/supabase-js";
import {serverEnv} from "@/lib/env";

const schema=z.object({
 fullName:z.string().trim().min(2).max(160),
 email:z.string().trim().email().max(254).optional().or(z.literal("")),
 phone:z.string().trim().max(40).optional().or(z.literal("")),
 classLevel:z.coerce.number().int().min(1).max(12),
 sectionName:z.string().trim().max(80).optional().or(z.literal("")),
 guardianName:z.string().trim().min(2).max(160),
 guardianContact:z.string().trim().min(5).max(80),
 consent:z.literal(true),
 website:z.string().max(0).optional().or(z.literal("")),
});
export async function POST(req:Request){
 try{
  const body=await req.json();
  const input=schema.parse(body);
  if(input.website) return NextResponse.json({ok:true});
  const db=createClient(serverEnv.SUPABASE_URL,serverEnv.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}});
  const {error}=await db.from("student_applications").insert({
   full_name:input.fullName,email:input.email||null,phone:input.phone||null,
   class_level:input.classLevel,section_name:input.sectionName||null,
   guardian_name:input.guardianName,guardian_contact:input.guardianContact,consent_at:new Date().toISOString(),status:"pending"
  });
  if(error) return NextResponse.json({ok:false,message:"Não foi possível receber o pedido."},{status:400});
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({ok:false,message:"Dados inválidos."},{status:400});}
}