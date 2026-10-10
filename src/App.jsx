import React, { useMemo, useState, useCallback } from "react";
import site from "./data/site.json";
import catalogue from "./data/products.json";
import { waLink, money } from "./lib/whatsapp";
import Hero from "./components/Hero";
import GlassNav from "./components/GlassNav";
import Reveal from "./components/Reveal";
import Modal from "./components/Modal";
import ProductPhoto from "./components/ProductPhoto";
import Blobs from "./components/Blobs";

const items = catalogue.items;
const byId = (id) => items.find((p) => p.id === id);
const priceText = (p) => {
  const t = money(p.price, site.currency, site.priceFallback);
  return p.price === null || p.price === undefined ? t : `${t} ${site.priceSuffix || ""}`.trim();
};
const avail = (p) => site.availability[p.availability] || site.availability.enquire;

export default function App() {
  const [room, setRoom] = useState(site.rooms.allLabel);
  const [selId, setSelId] = useState(null);
  const [colour, setColour] = useState(null);
  const [mode, setMode] = useState(site.modes[0]);

  const shown = useMemo(
    () => items.filter((p) => room === site.rooms.allLabel || p.category === room),
    [room]
  );
  const cur = selId ? byId(selId) : null;
  const openProduct = (p) => {
    setSelId(p.id);
    setColour(p.colours?.[0]?.name ?? null);
  };
  const close = useCallback(() => setSelId(null), []);
  const pickRoom = (r) => {
    setRoom(r);
    const el = document.getElementById("shop");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const name = site.business.name;
  const orderLink = cur
    ? waLink(
        site.contact.whatsapp,
        `Hi ${name}, I am interested in the ${cur.name}${colour ? ` (${colour}, ${cur.dims})` : ` (${cur.dims})`} at ${priceText(cur)}. I would like ${mode.toLowerCase()}. Is it available?`
      )
    : "#";
  const roomNames = [site.rooms.allLabel, ...site.rooms.list.map((r) => r.name)];

  return (
    <div className="relative">
      <Blobs />
      <div className="mx-auto max-w-[1280px]">
        <GlassNav site={site} links={site.nav.links} cta={site.nav.cta} message={site.messages.general} />

        <Hero site={site}>
          <a className="btn" style={{ background: "#fff", color: "var(--ink)" }} href="#shop">{site.hero.primaryCta}</a>
          <a className="btn glass-dark" href="#delivery">{site.hero.secondaryCta}</a>
        </Hero>

        <Reveal as="section" id="rooms" className="px-6 pt-16 pb-6">
          <h2 className="text-4xl font-normal tracking-tight mb-5">{site.rooms.title}</h2>
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))" }}>
            {site.rooms.list.map((r, i) => (
              <Reveal key={r.name} delay={i * 60}>
                <button
                  type="button"
                  className="lift w-full text-left rounded-[28px] p-5 flex flex-col justify-end min-h-[300px] shadow-lg"
                  style={{ background: r.gradient, color: "var(--ink)" }}
                  onClick={() => pickRoom(r.name)}
                >
                  <span className="glass self-start rounded-2xl px-4 py-2.5 flex flex-col">
                    <span className="font-display font-semibold text-2xl">{r.name}</span>
                    <span className="text-sm">{items.filter((p) => p.category === r.name).length} {site.rooms.itemsLabel}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" id="shop" className="px-6 py-12">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 mb-6">
            <h2 className="text-4xl font-normal tracking-tight">{site.rooms.shopTitle}</h2>
            <div className="glass rounded-full p-2 flex flex-wrap gap-1.5">
              {roomNames.map((r) => (
                <button key={r} type="button" className="chip pill-dark font-bold" style={{ minHeight: 42, padding: "0 16px", background: room === r ? "var(--ink)" : "transparent", color: room === r ? "#fff" : "var(--ink)", border: 0 }} aria-pressed={room === r} onClick={() => setRoom(r)}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-x-5 gap-y-7" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))" }}>
            {shown.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 70}>
                <button type="button" className="lift glass w-full text-left rounded-[28px] p-3 flex flex-col gap-3" aria-label={`${p.name}, ${priceText(p)}`} onClick={() => openProduct(p)}>
                  <ProductPhoto product={p} ratio="4 / 5" className="rounded-[20px]" />
                  <div className="flex justify-between items-baseline gap-3 px-1.5">
                    <span className="font-display font-semibold text-xl">{p.name}</span>
                    <span className="font-bold whitespace-nowrap">{priceText(p)}</span>
                  </div>
                  <div className="text-sm text-muted px-1.5">{p.dims}</div>
                  <div className="text-[13px] font-bold px-1.5 pb-1.5" style={{ color: avail(p).color }}>{avail(p).label}</div>
                </button>
              </Reveal>
            ))}
          </div>
          {shown.length === 0 ? <div className="glass rounded-3xl p-10 text-center text-muted">{site.rooms.emptyText}</div> : null}
        </Reveal>

        <section id="delivery" className="px-4 py-6 grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))" }}>
          {site.delivery.cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 80} className="glass rounded-[30px] p-8 flex flex-col gap-2.5">
              <h2 className="text-3xl font-normal">{c.title}</h2>
              <p className="text-muted leading-relaxed">{c.text}</p>
            </Reveal>
          ))}
        </section>

        <Reveal as="section" id="visit" className="glass mx-4 my-6 rounded-[36px] px-7 py-11 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-4xl font-normal mb-2">{site.visit.title}</h2>
            <p className="text-muted">{site.visit.text}</p>
          </div>
          <a className="btn" style={{ padding: "16px 28px" }} href={waLink(site.contact.whatsapp, site.visit.message)} target="_blank" rel="noopener noreferrer">{site.visit.cta}</a>
        </Reveal>

        <footer className="px-6 pt-4 pb-8 text-[13px] text-muted flex flex-wrap justify-between gap-x-6 gap-y-2">
          <span>{site.business.isSample ? `${site.business.sampleNote} ` : ""}{site.footer.left}</span>
          <span>{site.footer.right}</span>
        </footer>
      </div>

      <Modal open={!!cur} onClose={close} label={cur ? cur.name : "Product details"}>
        {cur ? (
          <div className="flex flex-wrap gap-7 clear-both">
            <div className="flex-1 min-w-[260px]">
              <ProductPhoto product={cur} ratio="4 / 5" className="rounded-3xl max-h-[520px]" />
            </div>
            <div className="flex-1 min-w-[260px] flex flex-col gap-4">
              <span className="text-[13px] uppercase tracking-widest text-muted">{cur.category}</span>
              <h3 className="text-4xl font-normal tracking-tight leading-tight">{cur.name}</h3>
              <div className="text-2xl font-bold">{priceText(cur)}</div>
              <p className="leading-relaxed text-muted">{cur.description}</p>
              <table className="w-full text-[15px] border-collapse">
                <tbody>
                  <tr><td className="py-2 w-[36%] text-muted border-b border-black/10">{site.modal.sizeLabel}</td><td className="py-2 border-b border-black/10">{cur.dims}</td></tr>
                  <tr><td className="py-2 text-muted border-b border-black/10">{site.modal.materialLabel}</td><td className="py-2 border-b border-black/10">{cur.material}</td></tr>
                  <tr><td className="py-2 text-muted">{site.modal.availabilityLabel}</td><td className="py-2 font-bold" style={{ color: avail(cur).color }}>{avail(cur).label}</td></tr>
                </tbody>
              </table>
              {cur.colours?.length ? (
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-sm">{site.modal.colourLabel}: {colour}</span>
                  <div className="flex flex-wrap gap-2.5">
                    {cur.colours.map((k) => (
                      <button key={k.name} type="button" className="swatch" aria-label={k.name} aria-pressed={colour === k.name} style={{ background: k.hex }} onClick={() => setColour(k.name)} />
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="flex flex-col gap-2">
                <span className="font-bold text-sm">{site.modal.modeLabel}</span>
                <div className="flex flex-wrap gap-2">
                  {site.modes.map((m) => (
                    <button key={m} type="button" className="chip pill-dark font-bold" style={{ minHeight: 44, padding: "0 20px" }} aria-pressed={mode === m} onClick={() => setMode(m)}>{m}</button>
                  ))}
                </div>
              </div>
              <a className="btn" href={orderLink} target="_blank" rel="noopener noreferrer">{site.modal.enquire}</a>
              {cur.related?.length ? (
                <div className="flex flex-col gap-2">
                  <span className="font-bold text-sm">{site.modal.relatedLabel}</span>
                  <div className="flex flex-wrap gap-2">
                    {cur.related.map((id) => byId(id)).filter(Boolean).map((r) => (
                      <button key={r.id} type="button" className="chip" style={{ minHeight: 44, padding: "0 16px" }} onClick={() => openProduct(r)}>{r.name}</button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
