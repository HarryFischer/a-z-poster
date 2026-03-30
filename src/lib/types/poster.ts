export type FontChoice = 'playfair' | 'bebas' | 'dm-serif' | 'space-mono' | 'cormorant';

export interface PaperSize {
	id: string;
	label: string;
	dims: string;
	price: number;
	aspectRatio: number;
}

export interface PrintTechnique {
	id: string;
	label: string;
	description: string;
	price: number;
}

export interface LayoutOption {
	id: string;
	label: string;
	letterX: number;
	letterY: number;
	letterScale: number;
	wordX: number;
	wordY: number;
	wordScale: number;
	rotation: number;
	decorativeElement: 'none' | 'rule-bottom' | 'rule-full' | 'double-border' | 'grid-lines' | 'diagonal';
	anchor: 'center' | 'left';
}

export interface PosterState {
	letter: string;
	word: string;
	font: FontChoice;
	bg: string;
	fg: string;
	paperSize: PaperSize;
	technique: PrintTechnique;
	activeLayout: LayoutOption | null;
	generated: boolean;
}
