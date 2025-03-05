export enum Layout {
	Horizontal = "Horizontal",
	Vertical = "Vertical"
}

export function getLayout(rawLayout: string): Layout {
	// Mapping raw values to a Layout enum; defaults to Vertical
	const layoutMap: Record<string, Layout> = {
		"0": Layout.Vertical,
		"1": Layout.Horizontal,
		"Vertical": Layout.Vertical,
		"Horizontal": Layout.Horizontal
	};
	return layoutMap[rawLayout] || Layout.Vertical;
}
