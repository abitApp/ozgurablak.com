import { AboutFencingVideo } from "@/components/home/AboutFencingVideo";

export function AboutMe() {
  return (
    <section
      id="about"
      className="scroll-mt-24 bg-surface px-5 py-20 text-ink md:scroll-mt-28 md:px-8 md:py-28"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-[72rem]">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-center md:justify-between md:gap-14 lg:gap-16">
          <div className="min-w-0 w-full max-w-2xl">
            <h2
              id="about-heading"
              className="text-[clamp(calc(2rem-12pt),calc(4vw-12pt),calc(3.25rem-12pt))] font-semibold tracking-tight text-balance"
            >
              About me
            </h2>
            <div className="mt-6 space-y-5 text-base leading-relaxed text-ink-muted md:mt-8 md:text-lg">
              <p>
                Senior Product Designer with 15+ years in UX/UI and design
                systems. I ran my own design agency for six years and am at home
                in agile teams. I believe a designer has to know when to follow
                their instinct and when to follow users&apos; advice. As the old
                saying goes: &quot;If I had asked people what they wanted, they
                would have said faster horses.&quot;
              </p>
              <p>
                I&apos;m now moving into AI product design. I launched Faldium, a
                companion and fortune-telling app that is live in about 15
                countries, and I keep improving it by analysing how people use
                it. So far it has a 4.6 average from 23 ratings.
              </p>
              <p>
                Based in Düsseldorf. I love{" "}
                <span className="tried-wave font-bold text-ink">fencing</span>,
                where poking people with a sword is the whole point. My other
                hobby is fixing and riding e-bikes, usually in that order. At
                home I build imaginary worlds in Blender, write scripts and make
                short films for myself.
              </p>
            </div>
          </div>

          <div className="relative z-0 mx-auto w-full min-w-0 max-w-[18.15rem] shrink-0 translate-y-[30px] overflow-visible md:mx-0 md:ml-auto md:max-w-[19.8rem] lg:max-w-[21.45rem]">
            <AboutFencingVideo />
          </div>
        </div>
      </div>
    </section>
  );
}
