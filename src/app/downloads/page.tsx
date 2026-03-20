"use client";

export default function DownloadsPage() {
	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#0e0e1a", padding: "16px" }}>
			<div style={{ textAlign: "center", marginBottom: "8px" }}>
				<h1 style={{ fontFamily: "monospace", fontSize: "32px", fontWeight: "bold", color: "#c43c3c", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
					Downloads
				</h1>
				<p style={{ fontFamily: "monospace", fontSize: "12px", color: "#a89878", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "24px" }}>
					Get Notakto for Your Platform
				</p>
			</div>
			<div style={{ display: "grid", gap: "16px", width: "100%", maxWidth: "768px" }}>
				<div style={{ backgroundColor: "#1e1e32", border: "3px solid #3a3a56", boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
						<span style={{ fontFamily: "monospace", fontSize: "20px", color: "#c8a040", width: "32px", textAlign: "center" }}>W</span>
						<div>
							<div style={{ fontFamily: "monospace", fontSize: "10px", color: "#e4d8c0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
								Windows
							</div>
							<div style={{ fontFamily: "monospace", fontSize: "7px", color: "#a89878", marginTop: "4px" }}>
								Windows 10+
							</div>
						</div>
					</div>
					<button type="button" style={{ backgroundColor: "#2a2a3a", color: "#6e6e88", padding: "8px 16px", fontSize: "8px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", border: "3px solid #3a4a4a", boxShadow: "3px 3px 0 #0e0e1a", cursor: "not-allowed" }} disabled>
						Coming Soon
					</button>
				</div>
				<div style={{ backgroundColor: "#1e1e32", border: "3px solid #3a3a56", boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
						<span style={{ fontFamily: "monospace", fontSize: "20px", color: "#c8a040", width: "32px", textAlign: "center" }}>M</span>
						<div>
							<div style={{ fontFamily: "monospace", fontSize: "10px", color: "#e4d8c0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
								macOS
							</div>
							<div style={{ fontFamily: "monospace", fontSize: "7px", color: "#a89878", marginTop: "4px" }}>
								macOS 12+
							</div>
						</div>
					</div>
					<button type="button" style={{ backgroundColor: "#2a2a3a", color: "#6e6e88", padding: "8px 16px", fontSize: "8px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", border: "3px solid #3a4a4a", boxShadow: "3px 3px 0 #0e0e1a", cursor: "not-allowed" }} disabled>
						Coming Soon
					</button>
				</div>
				<div style={{ backgroundColor: "#1e1e32", border: "3px solid #3a3a56", boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
						<span style={{ fontFamily: "monospace", fontSize: "20px", color: "#c8a040", width: "32px", textAlign: "center" }}>L</span>
						<div>
							<div style={{ fontFamily: "monospace", fontSize: "10px", color: "#e4d8c0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
								Linux
							</div>
							<div style={{ fontFamily: "monospace", fontSize: "7px", color: "#a89878", marginTop: "4px" }}>
								Ubuntu 20.04+
							</div>
						</div>
					</div>
					<button type="button" style={{ backgroundColor: "#2a2a3a", color: "#6e6e88", padding: "8px 16px", fontSize: "8px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", border: "3px solid #3a4a4a", boxShadow: "3px 3px 0 #0e0e1a", cursor: "not-allowed" }} disabled>
						Coming Soon
					</button>
				</div>
				<div style={{ backgroundColor: "#1e1e32", border: "3px solid #3a3a56", boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
						<span style={{ fontFamily: "monospace", fontSize: "20px", color: "#c8a040", width: "32px", textAlign: "center" }}>A</span>
						<div>
							<div style={{ fontFamily: "monospace", fontSize: "10px", color: "#e4d8c0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
								Android
							</div>
							<div style={{ fontFamily: "monospace", fontSize: "7px", color: "#a89878", marginTop: "4px" }}>
								Android 10+
							</div>
						</div>
					</div>
					<button type="button" style={{ backgroundColor: "#2a2a3a", color: "#6e6e88", padding: "8px 16px", fontSize: "8px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", border: "3px solid #3a4a4a", boxShadow: "3px 3px 0 #0e0e1a", cursor: "not-allowed" }} disabled>
						Coming Soon
					</button>
				</div>
				<div style={{ backgroundColor: "#1e1e32", border: "3px solid #3a3a56", boxShadow: "inset 0 0 0 1px #0e0e1a, 3px 3px 0 #0e0e1a", padding: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
						<span style={{ fontFamily: "monospace", fontSize: "20px", color: "#c8a040", width: "32px", textAlign: "center" }}>I</span>
						<div>
							<div style={{ fontFamily: "monospace", fontSize: "10px", color: "#e4d8c0", textTransform: "uppercase", letterSpacing: "0.1em" }}>
								iOS
							</div>
							<div style={{ fontFamily: "monospace", fontSize: "7px", color: "#a89878", marginTop: "4px" }}>
								iOS 15+
							</div>
						</div>
					</div>
					<button type="button" style={{ backgroundColor: "#2a2a3a", color: "#6e6e88", padding: "8px 16px", fontSize: "8px", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", border: "3px solid #3a4a4a", boxShadow: "3px 3px 0 #0e0e1a", cursor: "not-allowed" }} disabled>
						Coming Soon
					</button>
				</div>
			</div>
		</div>
	);
}