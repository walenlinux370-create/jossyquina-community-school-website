import "server-only";
import DOMPurify from "isomorphic-dompurify";
const allowedVideoHosts=new Set(["www.youtube.com","youtube.com","www.youtube-nocookie.com","youtube-nocookie.com"]);
export function sanitizeNewsHtml(html:string){return DOMPurify.sanitize(html,{USE_PROFILES:{html:true},FORBID_TAGS:["style","script","iframe","object","embed"],FORBID_ATTR:["style","onerror","onclick","onload"]})}
export function validateVideoEmbed(raw:string){const url=new URL(raw);if(url.protocol!=="https:"||!allowedVideoHosts.has(url.hostname))throw new Error("Video origin is not allowed");return url.toString()}
