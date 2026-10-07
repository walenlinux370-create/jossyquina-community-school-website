import { createFileRoute } from "@tanstack/react-router";

import logoAsset from "@/assets/logo-jossyquina.jpeg.asset.json";
import alunosImg from "@/assets/alunos.jpg";
import mapaImg from "@/assets/mapa.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Escola Comunitária Jossyquina — Mumemo 1, Marracuene" },
      {
        name: "description",
        content:
          "Ensino primário de qualidade no coração de Mumemo, Marracuene. Matrículas abertas para a 1ª classe — contacte 87 372 6610 ou 84 132 9460.",
      },
      { property: "og:title", content: "Escola Comunitária Jossyquina — Mumemo 1, Marracuene" },
      {
        property: "og:description",
        content:
          "Ensino primário de qualidade no coração de Mumemo, Marracuene. Matrículas abertas para a 1ª classe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const requisitos = [
  "Cópia autenticada do Bilhete de Identidade (BI)",
  "Cédula Pessoal ou Boletim de Nascimento",
  "3 Fotografias tipo passe recentes",
  "Documento de vacinação actualizado",
];

function CheckBullet() {
  return (
    <div className="mt-1 flex size-4 shrink-0 items-center justify-center rounded bg-gold/20">
      <div className="size-2 rounded-full bg-gold" />
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      {/* Navegação */}
      <nav className="bg-navy py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img
              src={logoAsset.url}
              alt="Logótipo da Escola Comunitária Jossyquina"
              className="size-10 rounded-full object-cover ring-1 ring-black/5"
            />
            <span className="font-medium tracking-tight text-paper">Escola Jossyquina</span>
          </div>
          <div className="hidden gap-8 text-sm text-paper/80 md:flex">
            <a href="#inicio" className="transition-colors hover:text-gold">
              Início
            </a>
            <a href="#sobre" className="transition-colors hover:text-gold">
              Sobre Nós
            </a>
            <a href="#matricula" className="transition-colors hover:text-gold">
              Matrículas
            </a>
            <a href="#contactos" className="transition-colors hover:text-gold">
              Contactos
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="inicio" className="bg-gold py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-[56ch]">
            <h1 className="mb-6 text-balance text-4xl font-semibold leading-tight text-navy lg:text-6xl">
              Educação Primária de Qualidade no Coração de Mumemo
            </h1>
            <p className="mb-10 text-pretty text-lg text-navy/80 lg:text-xl">
              A Escola Comunitária Jossyquina prepara o futuro das nossas crianças com valores
              sólidos e compromisso com a excelência em Marracuene.
            </p>
            <a
              href="#matricula"
              className="inline-flex items-center rounded-md bg-navy px-6 py-3 text-sm font-medium text-paper ring-1 ring-navy transition-transform hover:bg-navy/90"
            >
              Matricule o seu filho
            </a>
          </div>
        </div>
      </section>

      {/* Matrículas */}
      <section id="matricula" className="bg-paper py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <h2 className="mb-4 text-balance text-3xl font-semibold text-navy">
              Matrículas 2026
            </h2>
            <p className="max-w-[56ch] text-pretty text-sm text-zinc-600 sm:text-base">
              Estamos abertos para inscrições na 1ª Classe. Garanta a vaga do seu educando com
              antecedência.
            </p>
          </div>

          <div className="grid items-start gap-12 md:grid-cols-2">
            <div className="rounded-xl bg-zinc-50 p-8 ring-1 ring-black/5">
              <h3 className="mb-6 text-lg font-semibold text-navy">Documentação Necessária</h3>
              <ul className="space-y-4">
                {requisitos.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckBullet />
                    <span className="text-sm text-zinc-700 sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <img
                src={alunosImg}
                alt="Alunos da Escola Comunitária Jossyquina no pátio da escola"
                loading="lazy"
                width={1024}
                height={768}
                className="aspect-[4/3] w-full rounded-xl object-cover outline-1 -outline-offset-1 outline-black/5"
              />
              <div className="rounded-xl bg-navy p-6 text-paper">
                <p className="text-pretty text-sm leading-relaxed opacity-90">
                  "A educação é a ferramenta mais poderosa que podemos dar aos nossos filhos para
                  transformar a comunidade de Mumemo."
                </p>
                <p className="mt-4 text-xs font-medium uppercase tracking-wider text-gold">
                  Direcção da Escola
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre / Comunidade */}
      <section id="sobre" className="border-y border-zinc-200 bg-zinc-50 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-6 text-balance text-3xl font-semibold text-navy">
              Uma Escola Pela Comunidade
            </h2>
            <p className="mb-6 max-w-[56ch] text-pretty text-base text-zinc-700">
              Localizada no Bairro Mumemo 1, a Escola Comunitária Jossyquina nasceu da vontade de
              prover um ensino digno e acessível. Acreditamos que a escola é o centro da vida
              comunitária, onde cultivamos não apenas o intelecto, mas o carácter e a cidadania
              dos pequenos marracuenenses.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="mb-2 font-semibold text-gold">Missão</h4>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Formar cidadãos conscientes, críticos e preparados para os desafios do ensino
                  secundário.
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gold">Valores</h4>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Respeito, solidariedade comunitária e dedicação ao saber tradicional e moderno.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-8 shadow-sm ring-1 ring-black/5">
            <h3 className="mb-4 text-lg font-semibold text-navy">Horário de Funcionamento</h3>
            <p className="mb-2 text-sm text-zinc-600">Segunda a Sexta-feira</p>
            <p className="text-xl font-medium text-navy">07:30 — 15:30</p>
            <div className="mt-8 border-t border-zinc-100 pt-8">
              <h3 className="mb-4 text-lg font-semibold text-navy">Contactos Directos</h3>
              <div className="space-y-2">
                <a
                  href="tel:+258873726610"
                  className="block font-medium text-navy transition-colors hover:text-gold"
                >
                  +258 87 372 6610
                </a>
                <a
                  href="tel:+258841329460"
                  className="block font-medium text-navy transition-colors hover:text-gold"
                >
                  +258 84 132 9460
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Localização */}
      <section id="contactos" className="bg-paper py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="w-full md:w-1/2">
              <img
                src={mapaImg}
                alt="Mapa ilustrado da localização da escola no Bairro Mumemo 1"
                loading="lazy"
                width={1200}
                height={800}
                className="aspect-[16/9] w-full rounded-xl object-cover outline-1 -outline-offset-1 outline-black/5"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="mb-6 text-balance text-3xl font-semibold text-navy">Onde Estamos</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <div className="size-2 rounded-full bg-gold" />
                  </div>
                  <div>
                    <h4 className="font-medium text-navy">Endereço</h4>
                    <p className="text-sm text-zinc-600">Bairro Mumemo 1, Q-3, Parcela nº 7</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <div className="size-2 rounded-full bg-gold" />
                  </div>
                  <div>
                    <h4 className="font-medium text-navy">Pontos de Referência</h4>
                    <p className="text-pretty text-sm text-zinc-600">
                      Perto do Comité do Partido Frelimo, entre o mercadinho, posto policial e a
                      secretaria do bairro.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 shrink-0">
                    <div className="size-2 rounded-full bg-gold" />
                  </div>
                  <div>
                    <h4 className="font-medium text-navy">Distrito</h4>
                    <p className="text-sm text-zinc-600">Marracuene, Província de Maputo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-navy py-12 text-paper/60">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex flex-col items-start justify-between gap-8 border-b border-paper/10 pb-8 md:flex-row md:items-center">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-paper">
                Escola Comunitária Jossyquina
              </h3>
              <p className="text-sm">Mumemo 1 — Formando as gerações de amanhã.</p>
            </div>
            <div className="flex gap-6">
              <a href="#sobre" className="text-sm hover:text-gold">
                Sobre Nós
              </a>
              <a href="#matricula" className="text-sm hover:text-gold">
                Matrículas
              </a>
              <a href="#contactos" className="text-sm hover:text-gold">
                Contactos
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 text-xs md:flex-row">
            <p>© 2026 Escola Comunitária Jossyquina. Todos os direitos reservados.</p>
            <p>Mumemo 1, Marracuene, Moçambique.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
