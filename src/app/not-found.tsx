"use client";

import Link from "next/link";

// ===== STYLES =====
const styles = {
	staticPageLayout: {
		display: "flex",
		flexDirection: "column" as const,
		alignItems: "center",
		justifyContent: "center",
		minHeight: "100vh",
		backgroundColor: "#0e0e1a",
		padding: "16px",
	},
	centered: {
		textAlign: "center" as const,
	},
	title: {
		fontFamily: "monospace",
		fontSize: "32px",
		fontWeight: "bold",
		color: "#c43c3c",
		textTransform: "uppercase" as const,
		letterSpacing: "0.1em",
		marginBottom: "8px",
	},
	subtitle: {
		fontFamily: "monospace",
		fontSize: "12px",
		color: "#a89878",
		textTransform: "uppercase" as const,
		letterSpacing: "0.1em",
		marginBottom: "24px",
	},
	pixelButton: {
		display: "inline-block" as const,
		backgroundColor: "#c43c3c",
		color: "#e4d8c0",
		padding: "12px 24px",
		fontFamily: "monospace",
		fontSize: "10px",
		fontWeight: "bold",
		textTransform: "uppercase" as const,
		letterSpacing: "0.1em",
		border: "3px solid",
		borderColor: "#4e4e6a",
		boxShadow: "3px 3px 0 #0e0e1a",
		textDecoration: "none",
		cursor: "pointer",
		transition: "all 0.2s",
	},
};

// ===== COMPONENTS =====
function StaticPageLayout({
	title,
	subtitle,
	centered,
	children,
}: {
	title: string;
	subtitle: string;
	centered?: boolean;
	children: React.ReactNode;
}) {
	return (
		<div
			style={{
				...styles.staticPageLayout,
				...(centered ? styles.centered : {}),
			}}>
			<h1 style={styles.title}>{title}</h1>
			<p style={styles.subtitle}>{subtitle}</p>
			{children}
		</div>
	);
}

function PixelButton({
	children,
	onClick,
	style,
	...props
}: {
	children: React.ReactNode;
	onClick?: () => void;
	style?: React.CSSProperties;
	[key: string]: any;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			style={{ ...styles.pixelButton, ...style }}
			{...props}>
			{children}
		</button>
	);
}

// ===== MAIN COMPONENT =====
export default function NotFound() {
	return (
		<StaticPageLayout title="404" subtitle="PAGE NOT FOUND" centered>
			<Link href="/">
				<PixelButton onClick={() => {}}>Go back home</PixelButton>
			</Link>
		</StaticPageLayout>
	);
}
