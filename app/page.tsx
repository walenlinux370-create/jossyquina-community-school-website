import Link from "next/link";

const pillars = [
  ["Aprendizagem","Base sólida para cada criança crescer com confiança."],
  ["Comunidade","Uma escola próxima das famílias de Marracuene."],
  ["Valores","Respeito, responsabilidade e solidariedade."]
];

const portals = [
  ["Portal do Aluno","Consulte notas publicadas, faltas, horários e materiais de estudo.","/portal/login"],
  ["Painel do Professor","Acesso seguro às turmas e disciplinas atribuídas.","/professor"],
  ["Painel Administrativo","Gestão centralizada de alunos, currículo, notícias e horários.","/admin"]
];

export default function Home(){
 return <main>
  <header className="bg-white text-black border-b-4 border-[#e6bd55]">
   <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
    <Link href="/" className="flex items-center gap-3 font-bold text-[#c99d25]">
      <img src="/favicon.png" alt="Logótipo da Escola Comunitária Jossyquina" className="h-12 w-12 rounded-full object-cover" />
      <span>Escola Comunitária Jossyquina</span>
    </Link>
    <div className="hidden gap-6 text-sm md:flex"><Link href="/sobre-nos">Sobre Nós</Link><Link href="/oferta-formativa">Oferta Formativa</Link><Link href="/noticias">Notícias</Link><Link href="/contactos">Contactos</Link></div>
   </nav>
  </header>

  <section className="bg-[#e6bd55] px-6 py-20 lg:py-28">
   <div className="mx-auto max-w-7xl">
    <span className="rounded-full bg-black/10 px-4 py-2 text-xs font-bold uppercase tracking-widest">Educação que transforma</span>
    <h1 className="mt-7 max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">O futuro começa numa boa escola.</h1>
    <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">Uma plataforma escolar segura para alunos, professores, famílias e direção.</p>
    <div className="mt-9 flex flex-wrap gap-3"><Link href="/registo" className="rounded-full bg-white px-6 py-3 font-semibold text-black ring-2 ring-white">Inscrever Novo Aluno</Link><Link href="/portal/login" className="rounded-full border-2 border-black/30 bg-transparent px-6 py-3 font-semibold text-black">Aceder com Código</Link></div>
   </div>
  </section>

  <section className="mx-auto grid max-w-7xl gap-6 px-6 py-12 md:grid-cols-3">{pillars.map(([a,b])=><article key={a} className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-black/5"><h2 className="font-bold">{a}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{b}</p></article>)}</section>

  <section className="bg-slate-50 px-6 py-16">
   <div className="mx-auto max-w-7xl">
    <p className="text-xs font-bold uppercase tracking-widest text-[#b38718]">Plataforma integrada</p>
    <h2 className="mt-2 text-3xl font-bold">Tudo o que a comunidade escolar precisa, num só lugar.</h2>
    <div className="mt-8 grid gap-5 md:grid-cols-3">{portals.map(([title,desc,href])=><Link key={title} href={href} className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p><span className="mt-5 inline-block text-sm font-semibold text-[#b38718]">Aceder →</span></Link>)}</div>
   </div>
  </section>

  <section className="border-y bg-white px-6 py-16">
   <div className="mx-auto max-w-7xl">
    <h2 className="text-3xl font-bold">Uma escola. Um só sistema.</h2>
    <p className="mt-4 max-w-2xl leading-7 text-slate-600">A direção gere informação institucional, professores trabalham apenas com as suas turmas e cada aluno consulta somente os seus dados académicos publicados.</p>
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border p-5"><h3 className="font-bold">Segurança e privacidade</h3><p className="mt-2 text-sm leading-6 text-slate-600">Acesso protegido por função, RLS e auditoria para operações sensíveis.</p></div>
      <div className="rounded-2xl border p-5"><h3 className="font-bold">1ª à 12ª Classe</h3><p className="mt-2 text-sm leading-6 text-slate-600">Oferta preparada para o ensino primário e secundário, com currículo e turmas geridos pela direção.</p></div>
    </div>
   </div>
  </section>

  <div className="sticky bottom-0 z-40 border-t bg-white/95 p-3 shadow-lg backdrop-blur md:hidden"><div className="flex gap-2"><Link className="flex-1 rounded-xl bg-[#e6bd55] px-3 py-3 text-center text-sm font-semibold text-black" href="/registo">Inscrever</Link><Link className="flex-1 rounded-xl border px-3 py-3 text-center text-sm font-semibold" href="/portal/login">Entrar</Link></div></div>
 </main>
}
