"use client";

import React from "react";

function ReachOut() {

  return (
    <section className="bg-white text-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-20 px-6 py-24">
        {/* HEADING */}
        <div className="relative text-center">
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="h-48 w-48 rounded-full blur-3xl opacity-30" style={{ background: "linear-gradient(135deg,#D8234B,#FFD3D5)" }} />
          </div>
          <p className="inline-flex items-center rounded-full border border-[#FFD3D5] bg-[#FFD3D5]/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-[#D8234B]">
            Contact Us
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            We're Here for Your Skin’s Journey
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Questions about products, orders, or building a routine? The U&amp;I Naturals support team would love to help.
          </p>
        </div>

        {/* CONTACT DETAILS ONLY */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-[#FFD3D5] bg-white p-6 shadow-sm transition hover:shadow-md">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#D8234B]">Email</h2>
            <p className="mt-2 text-lg font-medium">info@uandinaturals.com</p>
            <p className="mt-1 text-sm text-slate-500">Product queries, orders &amp; support</p>
          </div>
          <div className="rounded-2xl border border-[#FFD3D5] bg-white p-6 shadow-sm transition hover:shadow-md">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#D8234B]">Phone</h2>
            <p className="mt-2 text-lg font-medium">+91 73388 73353</p>
            <p className="mt-1 text-sm text-slate-500">Mon – Fri, 10 AM – 6 PM IST</p>
          </div>
          <div className="rounded-2xl border border-[#FFD3D5] bg-white p-6 shadow-sm transition hover:shadow-md">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#D8234B]">Address</h2>
            <p className="mt-2 text-lg font-medium">U&amp;I Naturals</p>
            <p className="text-sm text-slate-500">Coimbatore, Tamil Nadu, India — 641038</p>
          </div>
          <div className="rounded-2xl border border-[#FFD3D5] bg-white p-6 shadow-sm transition hover:shadow-md">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-[#D8234B]">Follow</h2>
            <p className="mt-2 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-[#FFD3D5]/60 px-3 py-1">Instagram</span>
              <span className="rounded-full bg-[#FFD3D5]/60 px-3 py-1">YouTube</span>
              <span className="rounded-full bg-[#FFD3D5]/60 px-3 py-1">Facebook</span>
            </p>
          </div>
        </div>

        {/* FOOTNOTE */}
        <div className="rounded-3xl border border-[#FFD3D5] bg-[#FFD3D5]/40 p-8 text-sm text-slate-700 shadow-sm text-center">
          <p>
            Drop by to try our products, explore ingredients, or just say hello — your skin’s story matters to us.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ReachOut;
