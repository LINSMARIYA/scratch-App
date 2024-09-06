type Sprite = {
	src: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
	name: string;
	x: number;
	y: number;
	rotation: number;
	label: string;
};

type StageSprites = {
	src: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
	name: string;
	x: number;
	y: number;
	rotation: number;
	id: string;
};

type BlockAction = {
	type: string;
	value: string;
	x: number;
	y: number;
};

type BlockType = {
	type: string;
	value: string;
	x: number;
	y: number;
};

type SpriteBlockType = {
	id: string;
	blocks: BlockType[];
};

export type { BlockAction, Sprite, StageSprites, SpriteBlockType, BlockType };
