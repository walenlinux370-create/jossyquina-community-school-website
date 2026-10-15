import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock3, MapPin, Phone, ShieldCheck, Users } from "lucide-react";

import logoAsset from "@/assets/logo-jossyquina.jpeg.asset.json";
import alunosImg from "@/assets/alunos.jpg";
import mapaImg from "@/assets/mapa.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Escola Comunitária Jossyquina | Mumemo 1, Marracuene" },
      {
        name: "description",
        content:
          "Escola Comunitária Jossyquina: educação primária de qualidade, ambiente seguro e compromisso com a comunidade em Mumemo 1, Marracuene.",
      },
      { property: "og:title", content: "Escola Comunitária Jossyquina" },
      {
        property: "og:description",
        content: "Educação primária de qualidade no coração de Mumemo 1, Marracuene.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Index,
});

const requisitos = [
  "Cópia autenticada do Bilhete de Identidade (BI)",
  "Cédula Pessoal ou Boletim de Nascimento",
  "3 fotografias tipo passe recentes",
  "Documento de vacinação actualizado",
];

const pilares = [
  {
    icon: BookOpen,
    title: "Aprendizagem",
    text: "Uma base sólida para que cada criança cresça com confiança e gosto pelo conhecimento.",
  },
  {
    icon: Users,
    title: "Comunidade",
    text: "Uma escola próxima das famílias, construída para servir e fortalecer a comunidade.",
  },
  {
    icon: ShieldCheck,
    title: "Valores",
    text: "Respeito, responsabilidade, solidariedade e dedicação fazem parte da nossa formação.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-black font-sans text-ink">
      <div className="bg-zinc-950 px-6 py-2 text-center text-xs font-medium text-white/80">
        Matrículas 2026 abertas para a 1ª Classe · Mumemo 1, Marracuene
      </div>

      <nav className="sticky top-0 z-50 border-b border-paper/10 bg-zinc-950/95 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <a href="#inicio" className="flex items-center gap-3">
            <img
              src={logoAsset.url}
              alt="Logótipo da Escola Comunitária Jossyquina"
              className="size-11 rounded-full object-cover ring-2 ring-gold/40"
            />
            <div>
              <p className="font-semibold tracking-tight text-white">Escola Jossyquina</p>
              <p className="text-[11px] text-white/60">Mumemo 1 · Marracuene</p>
            </div>
          </a>

          <div className="hidden items-center gap-7 text-sm text-white/75 md:flex">
            <a href="#sobre" className="transition-colors hover:text-gold">A Escola</a>
            <a href="#matricula" className="transition-colors hover:text-gold">Matrículas</a>
            <a href="#contactos" className="transition-colors hover:text-gold">Contactos</a>
            <a href="/auth" className="rounded-full border border-paper/20 px-4 py-2 transition-colors hover:border-gold hover:text-gold">
              Área reservada
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section id="inicio" className="relative overflow-hidden bg-black">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
            <div>
              <span className="inline-flex rounded-full bg-zinc-950/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                Educação que transforma
              </span>
              <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
                O futuro começa numa boa escola.
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg leading-8 text-white/75 sm:text-xl">
                Na Escola Comunitária Jossyquina, ajudamos cada criança a aprender, crescer e
                construir um futuro melhor para si, para a família e para a comunidade.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#matricula"
                  className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-navy/15 transition-transform hover:-translate-y-0.5"
                >
                  Ver como matricular
                  <ArrowRight className="size-4" />
                </a>
                <a
                  href="tel:+258873726610"
                  className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-black/40 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-black"
                >
                  <Phone className="size-4" />
                  +258 87 372 6610
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-white/65">
                <span className="inline-flex items-center gap-2"><MapPin className="size-4" />Mumemo 1</span>
                <span className="inline-flex items-center gap-2"><Clock3 className="size-4" />07:30 — 15:30</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-black/25 blur-2xl" />
              <img
                src={alunosImg}
                alt="Alunos da Escola Comunitária Jossyquina"
                width={1024}
                height={768}
                className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl ring-4 ring-paper/60"
              />
              <div className="absolute -bottom-5 left-5 rounded-2xl bg-zinc-950 px-5 py-4 text-white shadow-xl">
                <p className="text-xs uppercase tracking-wider text-gold">Matrículas abertas</p>
                <p className="mt-1 font-semibold">1ª Classe · 2026</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-zinc-200 bg-black py-10">
          <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:grid-cols-3">
            {pilares.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-zinc-950 p-6 ring-1 ring-black/5">
                <Icon className="size-6 text-gold" />
                <h2 className="mt-4 font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="sobre" className="bg-black py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Sobre a escola</p>
              <h2 className="mt-4 max-w-2xl text-balance text-4xl font-semibold tracking-tight text-white">
                Uma escola feita para estar perto das famílias.
              </h2>
              <p className="mt-6 max-w-2xl text-pretty leading-8 text-zinc-300">
                Localizada no Bairro Mumemo 1, a Escola Comunitária Jossyquina trabalha para
                proporcionar um ensino digno, acessível e orientado para o desenvolvimento
                integral das crianças.
              </p>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="border-l-2 border-gold pl-5">
                  <h3 className="font-semibold text-white">Missão</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Formar cidadãos conscientes, responsáveis e preparados para os próximos
                    desafios da sua educação.
                  </p>
                </div>
                <div className="border-l-2 border-gold pl-5">
                  <h3 className="font-semibold text-white">Valores</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Respeito, solidariedade, responsabilidade e dedicação ao saber.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-zinc-950 p-8 text-white shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">No dia a dia</p>
              <div className="mt-8 space-y-7">
                <div>
                  <p className="text-3xl font-semibold">07:30 — 15:30</p>
                  <p className="mt-1 text-sm text-white/60">Segunda a sexta-feira</p>
                </div>
                <div className="border-t border-paper/10 pt-7">
                  <p className="text-sm leading-6 text-white/70">
                    Um ambiente de aprendizagem com acompanhamento próximo e uma forte ligação à
                    comunidade de Marracuene.
                  </p>
                </div>
                <a href="#contactos" className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-white">
                  Visitar a escola <ArrowRight className="size-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="matricula" className="bg-zinc-950 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Matrículas 2026</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-white">
                Prepare a entrada do seu educando.
              </h2>
              <p className="mt-5 leading-7 text-zinc-300">
                As inscrições para a 1ª Classe estão abertas. Reúna a documentação abaixo e entre
                em contacto com a escola para confirmar os próximos passos.
              </p>
            </div>

            <div className="mt-12 grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
              <div className="rounded-3xl bg-zinc-950 p-8 shadow-sm ring-1 ring-black/5">
                <h3 className="text-xl font-semibold text-white">Documentação necessária</h3>
                <ul className="mt-7 space-y-5">
                  {requisitos.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-zinc-200">
                      <span className="mt-2 size-2 shrink-0 rounded-full bg-black" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href="tel:+258841329460"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-white hover:bg-zinc-950/90"
                >
                  <Phone className="size-4" />
                  Falar com a escola
                </a>
              </div>

              <div className="overflow-hidden rounded-3xl bg-zinc-950 shadow-xl">
                <img
                  src={alunosImg}
                  alt="Crianças da Escola Comunitária Jossyquina"
                  width={1024}
                  height={768}
                  className="h-64 w-full object-cover sm:h-80"
                />
                <div className="p-8 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-gold">Mensagem da Direcção</p>
                  <blockquote className="mt-5 text-2xl font-medium leading-9">
                    “A educação é uma ferramenta para transformar a vida das nossas crianças e a
                    nossa comunidade.”
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contactos" className="bg-black py-20 lg:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Contactos</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Estamos em Mumemo 1.</h2>
              <div className="mt-8 space-y-6">
                <div className="flex gap-4">
                  <MapPin className="mt-1 size-5 shrink-0 text-gold" />
                  <div>
                    <h3 className="font-semibold text-white">Endereço</h3>
                    <p className="mt-1 text-sm leading-6 text-zinc-300">
                      Bairro Mumemo 1, Q-3, Parcela nº 7, Marracuene, Província de Maputo.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="mt-1 size-5 shrink-0 text-gold" />
                  <div>
                    <h3 className="font-semibold text-white">Telefone</h3>
                    <div className="mt-1 space-y-1 text-sm">
                      <a href="tel:+258873726610" className="block text-zinc-300 hover:text-white">+258 87 372 6610</a>
                      <a href="tel:+258841329460" className="block text-zinc-300 hover:text-white">+258 84 132 9460</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <img
              src={mapaImg}
              alt="Mapa ilustrado da localização da escola no Bairro Mumemo 1"
              width={1200}
              height={800}
              className="aspect-[16/10] w-full rounded-3xl object-cover shadow-lg ring-1 ring-black/5"
            />
          </div>
        </section>

        <section className="bg-black py-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-2xl font-semibold text-white">Quer saber mais?</p>
              <p className="mt-1 text-sm text-white/65">Fale connosco sobre a matrícula do seu educando.</p>
            </div>
            <a href="tel:+258873726610" className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white">
              Contactar a escola <ArrowRight className="size-4" />
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-zinc-950 py-12 text-white/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-8 border-b border-paper/10 pb-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-semibold text-white">Escola Comunitária Jossyquina</p>
              <p className="mt-1 text-sm">Mumemo 1 — Formando as gerações de amanhã.</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <a href="#sobre" className="hover:text-gold">A Escola</a>
              <a href="#matricula" className="hover:text-gold">Matrículas</a>
              <a href="#contactos" className="hover:text-gold">Contactos</a>
              <a href="/auth" className="hover:text-gold">Área reservada</a>
            </div>
          </div>
          <div className="pt-6 text-xs">© 2026 Escola Comunitária Jossyquina · Mumemo 1, Marracuene, Moçambique.</div>
        </div>
      </footer>
    </div>
  );
}
