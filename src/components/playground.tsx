/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
import React, { Dispatch, SetStateAction } from 'react';

import BlockWithInput from './blockInput';

import { BlockType, SpriteBlockType } from '../type';

const Playground = ({
	spriteBlock,
	setBlocks,
	selectedSprite,
}: {
	spriteBlock: SpriteBlockType[];
	setBlocks: Dispatch<SetStateAction<SpriteBlockType[]>>;
	selectedSprite: string;
	setSelectedSprite: Dispatch<SetStateAction<string>>;
}) => {
	const blocks =
		spriteBlock?.filter(
			(block: SpriteBlockType) => block.id === selectedSprite
		)?.[0]?.blocks ?? [];

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const type = e.dataTransfer.getData('blockLabel');
		const value = e.dataTransfer.getData('blockValue');

		const dropAreaRect = e.currentTarget.getBoundingClientRect();
		const x = dropAreaRect.width / 2 - 50;
		const y = dropAreaRect.height / 2 - 50;
		if (type && value) {
			setBlocks((prevSprites: SpriteBlockType[]) =>
				prevSprites.map((sprite: SpriteBlockType) =>
					sprite.id === selectedSprite
						? { ...sprite, blocks: [...sprite.blocks, { type, value, x, y }] }
						: sprite
				)
			);
		}
	};

	const updateBlockValue = (actionIndex: number, newValue: string) => {
		setBlocks((prevSprites) =>
			prevSprites.map((sprite: SpriteBlockType) =>
				sprite.id === selectedSprite
					? {
							...sprite,
							blocks: sprite.blocks?.map((block: BlockType, index: number) =>
								actionIndex === index ? { ...block, value: newValue } : block
							),
						}
					: sprite
			)
		);
	};

	return (
		<div className="p-4 h-[calc(100vh-80px)] bg-white">
			<div
				className="w-full h-full border-gray-500 mt-4 relative"
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
			>
				<p className="text-center pt-6 text-gray-500">
					{blocks.length == 0 ? 'Drop Here' : ''}
				</p>
				<div className="flex flex-col gap-2 mt-4">
					{blocks.map((block, index) => (
						<div
							key={index}
							className=" p-2 bg-blue-400 rounded"
							style={{ left: block.x, top: block.y }}
						>
							<BlockWithInput
								blockType={block.type}
								initialValue={block.value}
								onValueUpdate={(newValue) => updateBlockValue(index, newValue)}
							/>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Playground;
