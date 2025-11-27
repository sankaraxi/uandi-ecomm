"use client";

import React, { useState } from "react";

export default function PromoBar({ product = "Milk Powder Face Wash", code = "HURRY20" }) {
	const [visible, setVisible] = useState(true);

	if (!visible) return null;

	return (
		<div
			role="region"
			aria-label="Promotional banner"
			className="w-full bg-gradient-to-r from-[#ff7a18] to-[#af002d] text-white py-2 px-4 text-sm flex items-center justify-center relative"
		>
			<div className="flex items-center gap-3 flex-wrap justify-center">
				<span className="opacity-95">
					Product Of The Month: <strong>{product}</strong>
				</span>

				<span className="opacity-90" aria-hidden>
					|
				</span>

				<span className="opacity-95">
					Use code <strong className="uppercase tracking-wide">{code}</strong> &amp; Get <strong>FLAT 20% OFF</strong>
				</span>
			</div>

			<button
				onClick={() => setVisible(false)}
				aria-label="Close promotional banner"
				className="absolute right-2 top-1 text-white bg-transparent text-xl leading-none p-1"
			>
				×
			</button>
		</div>
	);
}
