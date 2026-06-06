/** @type {import("dependency-cruiser").IConfiguration} */
module.exports = {
	forbidden: [
		{
			name: "no-circular",
			severity: "error",
			comment: "Prevent circular imports.",
			from: {},
			to: { circular: true },
		},
	],
	options: {
		doNotFollow: {
			path: "node_modules",
		},
		exclude: {
			path: "node_modules|\\.next|coverage",
		},
		tsConfig: {
			fileName: "tsconfig.json",
		},
		tsPreCompilationDeps: true,
	},
};
