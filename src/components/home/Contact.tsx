"use client";

import { useState } from "react";
import { contact } from "@/content/home";

const CONTACT_BLUE = "#A8B4F0";
const CONTACT_BLUE_SOFT = "rgba(168, 180, 240, 0.22)";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const outlinePill =
    "inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/25 px-5 text-[0.88rem] font-medium tracking-wide text-white/90 transition-colors hover:border-white/45 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]";

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-surface px-5 py-24 text-ink md:scroll-mt-28 md:px-8 md:py-32"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto flex max-w-[72rem] flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-10 lg:gap-16">
        <h2
          id="contact-heading"
          className="min-w-0 max-w-[22ch] shrink text-[clamp(1.65rem,4vw,3rem)] font-semibold leading-[1.28] tracking-tight text-ink text-balance"
        >
          Hiring a senior or lead product designer?
          <br />
          <span style={{ color: CONTACT_BLUE }}>Say hello.</span>
        </h2>

        <div className="flex min-w-0 flex-col gap-5 md:items-end">
          <div className="flex flex-wrap items-center gap-4 md:justify-end">
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex min-h-11 shrink-0 cursor-pointer items-center justify-center rounded-full px-5 text-[0.88rem] font-medium tracking-wide transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
              style={{
                backgroundColor: CONTACT_BLUE_SOFT,
                color: CONTACT_BLUE,
              }}
            >
              {contact.email}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className={outlinePill}
              aria-live="polite"
            >
              {copied ? "Copied" : "Copy email"}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:justify-end">
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${outlinePill} gap-2`}
            >
              <svg
                className="size-4 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${contact.whatsappUsername}`}
              className={`${outlinePill} gap-2`}
            >
              <svg
                className="size-4 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.150-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              WhatsApp
            </a>
            <a
              href={contact.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${outlinePill} gap-2`}
            >
              <svg
                className="size-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M10 13h4" />
                <path d="M10 17h4" />
                <path d="M8 9h1" />
              </svg>
              View CV (PDF)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
