// Client-safe URL helpers — no fs imports

export function getPdfUrl(designId: string, letter: string): string {
	return `/posters/${designId}/pdfs/${letter.toUpperCase()}.pdf`;
}

export function getPreviewUrl(designId: string, letter: string): string {
	return `/posters/${designId}/previews/${letter.toUpperCase()}.jpg`;
}
