import React from 'react';
import BlockWithInput from './blockInput';

const Playground = ({
	blocks,
	setBlocks,
}: {
	blocks: { type: string; value: string; x: number; y: number }[];
	setBlocks: React.Dispatch<
		React.SetStateAction<
			{ type: string; value: string; x: number; y: number }[]
		>
	>;
}) => {

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const type = e.dataTransfer.getData('blockLabel');
		const value = e.dataTransfer.getData('blockValue');
		console.log(e, 'event');

		const dropAreaRect = e.currentTarget.getBoundingClientRect();
		const x = dropAreaRect.width / 2 - 50; // Adjust to center
		const y = dropAreaRect.height / 2 - 50; // Adjust to center

		setBlocks([...blocks, { type, value, x, y }]);
	};

	const updateBlockValue = (index: number, newValue: string) => {
		const updatedActions = [...blocks];
		updatedActions[index].value = newValue;
		setBlocks(updatedActions);
	  };


	return (
		<div className="p-4 h-[calc(100vh-80px)] bg-white">
			<div
				className="drop-area w-full h-full border-gray-500 mt-4 relative"
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
			>
				<p className="text-center pt-6 text-gray-500">{blocks.length==0 ?"Drop Here":""}</p>
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
