import Link from "next/link";

const pillars = [
  {
    number: "01",
    title: "Aprendizagem",
    description: "Uma base sólida para cada criança aprender, crescer e construir o seu futuro.",
  },
  {
    number: "02",
    title: "Comunidade",
    description: "Uma escola próxima das famílias e ligada à comunidade de Marracuene.",
  },
  {
    number: "03",
    title: "Valores",
    description: "Respeito, responsabilidade, solidariedade e dedicação ao conhecimento.",
  },
];

const portals = [
  {
    eyebrow: "PARA ESTUDANTES",
    title: "Portal do Aluno",
    description: "Consulte notas publicadas, frequência, horário e materiais da sua turma.",
    href: "/portal/login",
    symbol: "↗",
  },
  {
    eyebrow: "PARA PROFESSORES",
    title: "Painel do Professor",
    description: "Aceda às turmas atribuídas e faça a gestão de presenças e materiais.",
    href: "/professor",
    symbol: "↗",
  },
  {
    eyebrow: "PARA A DIREÇÃO",
    title: "Painel Administrativo",
    description: "Gestão centralizada da escola, dos alunos, dos conteúdos e dos horários.",
    href: "/admin",
    symbol: "↗",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-[#171717]">
      <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f1c84b] text-lg font-black text-black shadow-sm transition-transform group-hover:-rotate-3">
              J
            </span>
            <span>
              <span className="block text-sm font-extrabold tracking-tight sm:text-base">Jossyquina</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.17em] text-black/50">Escola Comunitária</span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 text-sm font-medium text-black/65 lg:flex">
            <Link className="transition hover:text-black" href="/sobre-nos">A escola</Link>
            <Link className="transition hover:text-black" href="/oferta-formativa">Oferta formativa</Link>
            <Link className="transition hover:text-black" href="/noticias">Notícias</Link>
            <Link className="transition hover:text-black" href="/contactos">Contactos</Link>
          </div>
          <Link href="/portal/login" className="rounded-full bg-[#171717] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-black/80 sm:px-5 sm:text-sm">
            Área reservada <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <section className="relative isolate">
        <div className="absolute -right-32 -top-36 -z-10 h-[28rem] w-[28rem] rounded-full bg-[#f8e9a7]/60 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-16 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e5bd3e]/50 bg-[#fff9df] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#72540a]">
              <span className="h-2 w-2 rounded-full bg-[#e5bd3e]" />
              Educação que transforma
            </span>
            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              O futuro começa <span className="relative inline-block">numa boa escola.<span className="absolute -bottom-1 left-0 -z-10 h-3 w-full -rotate-1 rounded-sm bg-[#f1c84b]/75 sm:h-4" /></span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-black/60 sm:text-lg sm:leading-8">
              Um espaço para aprender, crescer e construir oportunidades — com uma comunidade escolar mais próxima, organizada e preparada para o futuro.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/registo" className="inline-flex items-center gap-3 rounded-full bg-[#f1c84b] px-6 py-3.5 text-sm font-extrabold text-black shadow-[0_8px_24px_rgba(241,200,75,0.28)] transition hover:-translate-y-0.5 hover:bg-[#f5d46d]">
                Inscrever novo aluno <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/portal/login" className="inline-flex items-center gap-3 rounded-full border border-black/15 bg-white px-6 py-3.5 text-sm font-bold transition hover:border-black/40">
                Aceder ao portal
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-black/10 pt-6 text-xs font-semibold text-black/55 sm:text-sm">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#e5bd3e]" /> Ensino centrado no aluno</span>
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#e5bd3e]" /> Comunidade e família</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-[#f8e9a7]/55 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-black/5 bg-[#fbf8ee] p-5 shadow-[0_28px_80px_rgba(23,23,23,0.12)] sm:p-7">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/45">Aprender · Crescer · Pertencer</span>
                <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-black/60 ring-1 ring-black/5">JOSSYQUINA</span>
              </div>
              <div className="relative mt-5 flex min-h-[17rem] items-end overflow-hidden rounded-[1.5rem] bg-[#f1c84b] p-6 sm:min-h-[21rem] sm:p-8">
                <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full border-[28px] border-white/30" />
                <div className="absolute right-12 top-12 h-20 w-20 rounded-full bg-[#fff3c4]" />
                <div className="absolute bottom-0 right-0 h-36 w-3/4 rounded-tl-[8rem] bg-[#e4b936]" />
                <div className="absolute bottom-0 right-8 h-48 w-1/2 rounded-t-full bg-[#f7d976]" />
                <div className="relative z-10 max-w-xs">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-black/55">O nosso compromisso</span>
                  <p className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">Cada criança merece a oportunidade de brilhar.</p>
                </div>
                <span className="absolute right-5 top-5 text-4xl font-black text-white/80">✳</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-4 sm:gap-3">
                <div className="rounded-2xl bg-white p-3 sm:p-4"><span className="block text-lg font-black sm:text-2xl">01</span><span className="mt-1 block text-[10px] font-semibold text-black/50 sm:text-xs">Aprender</span></div>
                <div className="rounded-2xl bg-white p-3 sm:p-4"><span className="block text-lg font-black sm:text-2xl">02</span><span className="mt-1 block text-[10px] font-semibold text-black/50 sm:text-xs">Evoluir</span></div>
                <div className="rounded-2xl bg-white p-3 sm:p-4"><span className="block text-lg font-black sm:text-2xl">03</span><span className="mt-1 block text-[10px] font-semibold text-black/50 sm:text-xs">Conquistar</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-[#fffdf6]">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 py-7 sm:grid-cols-3 sm:px-8 sm:py-9">
          {pillars.map((pillar) => (
            <article key={pillar.number} className="flex gap-4 rounded-2xl p-4 transition hover:bg-white">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1c84b]/35 text-xs font-black">{pillar.number}</span>
              <div><h2 className="font-extrabold tracking-tight">{pillar.title}</h2><p className="mt-2 text-sm leading-6 text-black/55">{pillar.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#9b7510]">Plataforma integrada</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">A comunidade escolar, ligada num só lugar.</h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-black/55">Ferramentas dedicadas para alunos, professores e direção, com acesso adequado a cada função.</p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {portals.map((portal, index) => (
            <Link key={portal.title} href={portal.href} className="group flex min-h-64 flex-col rounded-[1.5rem] border border-black/10 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-[#e5bd3e] hover:shadow-[0_18px_45px_rgba(23,23,23,0.08)] sm:p-7">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#fff7d6] px-3 py-1.5 text-[10px] font-extrabold tracking-[0.13em] text-[#72540a]">{portal.eyebrow}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-lg transition group-hover:border-[#f1c84b] group-hover:bg-[#f1c84b]">{portal.symbol}</span>
              </div>
              <h3 className="mt-7 text-xl font-extrabold tracking-tight">{portal.title}</h3>
              <p className="mt-3 text-sm leading-6 text-black/55">{portal.description}</p>
              <span className="mt-auto pt-7 text-sm font-extrabold">Explorar acesso <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 overflow-hidden rounded-[2rem] bg-[#171717] p-7 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-14">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#f1c84b]">Uma escola. Uma comunidade.</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">O próximo passo começa aqui.</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">Conheça a escola, explore a oferta formativa ou entre em contacto para obter informações sobre matrículas.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/oferta-formativa" className="rounded-full bg-[#f1c84b] px-5 py-3 text-sm font-extrabold text-black transition hover:bg-[#f6d875]">Oferta formativa</Link>
            <Link href="/contactos" className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold transition hover:bg-white/10">Contactar a escola</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-xs text-black/50 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="font-semibold text-black/75">Escola Comunitária Jossyquina</div>
          <p>Educação que transforma · Marracuene, Moçambique</p>
          <div className="flex gap-4"><Link href="/sobre-nos" className="hover:text-black">A escola</Link><Link href="/contactos" className="hover:text-black">Contactos</Link><Link href="/auth" className="hover:text-black">Área reservada</Link></div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl gap-2">
          <Link className="flex-1 rounded-xl bg-[#f1c84b] px-3 py-3 text-center text-xs font-extrabold text-black" href="/registo">Inscrever aluno</Link>
          <Link className="flex-1 rounded-xl border border-black/15 px-3 py-3 text-center text-xs font-extrabold" href="/portal/login">Entrar no portal</Link>
        </div>
      </div>
    </main>
  );
}
