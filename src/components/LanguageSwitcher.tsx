"use client";

import { useLocale } from "next-intl";
import { type ChangeEvent, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/routing";

const languages = [
	{ code: "en", name: "English" },
	{ code: "es", name: "Español" },
	{ code: "fr", name: "Français" },
	{ code: "de", name: "Deutsch" },
	{ code: "zh", name: "Chinese" },
	{ code: "ja", name: "Japanese" },
	{ code: "hi", name: "हिन्दी" },
	{ code: "pt", name: "Português" },
];

export default function LanguageSwitcher() {
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	const onSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const nextLocale = e.target.value;
		startTransition(() => {
			router.replace(pathname, { locale: nextLocale });
		});
	};

	return (
		<div className="absolute top-4 right-4 z-[9999]">
			<select
				value={locale}
				onChange={onSelectChange}
				disabled={isPending}
				className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm font-vt323 hover:bg-gray-700 cursor-pointer"
				style={{ fontFamily: "inherit" }}>
				{languages.map((lang) => (
					<option key={lang.code} value={lang.code}>
						{lang.name}
					</option>
				))}
			</select>
		</div>
	);
}
