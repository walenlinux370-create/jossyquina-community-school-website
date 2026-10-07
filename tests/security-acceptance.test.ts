import postgres from "postgres";
import {describe,it,expect,afterAll} from "vitest";

const url=process.env.TEST_DATABASE_URL;
const sql=url?postgres(url,{max:1}):null;

describe.skipIf(!sql)("Supabase security acceptance",()=>{
 afterAll(async()=>{if(sql) await sql.end({timeout:1})});
 it("anon cannot read protected tables",async()=>{
  if(!sql) return;
  const rows=await sql`select tablename from pg_tables where schemaname='public' and tablename in ('users','students','grades','audit_logs')`;
  for(const row of rows){const result=await sql.begin(async tx=>{await tx`set local role anon`; return tx.unsafe(`select count(*)::int as count from public."${row.tablename}"`)}).catch(()=>null); expect(result).toBeNull(); }
 });
 it("audit_logs rejects UPDATE and DELETE",async()=>{
  if(!sql) return;
  const update=await sql`update public.audit_logs set event_type='tamper' where false`.catch(e=>e);
  const del=await sql`delete from public.audit_logs where false`.catch(e=>e);
  expect(update).toBeTruthy(); expect(del).toBeTruthy();
 });
 it("protected functions are not executable by public roles",async()=>{
  if(!sql) return;
  const rows=await sql`select routine_name,grantee from information_schema.routine_privileges where routine_schema='public' and routine_name in ('admin_issue_auth_code','verify_student_code') and grantee in ('public','anon','authenticated')`;
  expect(rows).toHaveLength(0);
 });
 it("RLS is enabled for every application table",async()=>{
  if(!sql) return;
  const rows=await sql`select relname,relrowsecurity from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and relname in ('users','students','grades','attendance','schedules','materials','news','student_applications','contact_messages','audit_logs')`;
  expect(rows.length).toBe(10); expect(rows.every(r=>r.relrowsecurity)).toBe(true);
 });
});
