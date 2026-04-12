// Client-safe URL helpers — no fs imports

export function getPdfUrl(designId: string, letter: string): string {
	return `/posters/${designId}/pdfs/${letter.toUpperCase()}.pdf`;
}

export function getPreviewUrl(designId: string, letter: string): string {
	// Preview files are named [LETTER]-[N].jpg where N is the numeric part of the design id
	// e.g. design-01 → A-1.jpg, design-02 → A-2.jpg
	const n = parseInt(designId.replace(/\D/g, ''), 10);
	return `/posters/${designId}/previews/${letter.toUpperCase()}-${n}.jpg`;
}
