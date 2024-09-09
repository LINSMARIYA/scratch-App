/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import React, {
	Dispatch,
	SetStateAction,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';

import { ReactComponent as cat } from '../assets/cat.svg';
import { ReactComponent as dog } from '../assets/dog.svg';

import { BlockAction, Sprite, SpriteBlockType, StageSprites } from '../type';

const ViewArea = ({
	blockActions,
	selectedSprite,
	setSelectedSprite,
	setBlocks,
}: {
	blockActions: SpriteBlockType[];
	selectedSprite: string;
	setBlocks: Dispatch<SetStateAction<SpriteBlockType[]>>;
	setSelectedSprite: Dispatch<SetStateAction<string>>;
}) => {
	const [stageSprites, setStageSprites] = useState<StageSprites[]>([]);
	const [isPlaying, setIsPlaying] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);

	const sprites = [
		{ src: cat, name: 'Sprite 1', x: 0, label: 'Cat', y: 0, rotation: 0 },
		{ src: dog, name: 'Sprite 2', x: 0, y: 0, label: 'Dog', rotation: 0 },
	];

	const detectCollision = (sprite1: StageSprites, sprite2: StageSprites) => {
		return !(
			sprite1.x + 100 < sprite2.x ||
			sprite1.x > sprite2.x + 100 ||
			sprite1.y + 100 < sprite2.y ||
			sprite1.y > sprite2.y + 100
		);
	};

	const actionList =
		blockActions?.filter((block) => block?.id === selectedSprite)?.[0]
			?.blocks ?? [];

	const handleCollision = useCallback(() => {
		if (selectedSprite) {
			const activeSprite = stageSprites.find(
				(sprite) => sprite.id === selectedSprite
			);
			// const activeSpriteActions =
			// 	blockActions.find((block) => block.id === selectedSprite)?.blocks || [];

			if (activeSprite) {
				const updatedSprites = [...stageSprites];
				let collisionDetected = false;
				for (const sprite of updatedSprites) {
					console.log('activeSprite:', activeSprite, sprite);
					if (
						sprite.id !== selectedSprite &&
						detectCollision(activeSprite, sprite)
					) {
						console.log(
							'Collision detected between:',
							selectedSprite,
							sprite.id
						);
						//Swap positions
						// const activeIndex = updatedSprites.findIndex((s) => s.id === selectedSprite);
						// const spriteIndex = updatedSprites.findIndex((s) => s.id === sprite.id);

						// Swap animations
						const activeActions =
							blockActions.find((b) => b.id === selectedSprite)?.blocks || [];
						const spriteActions =
							blockActions.find((b) => b.id === sprite.id)?.blocks || [];

						const updatedBlockActions = blockActions.map((b) =>
							b.id === selectedSprite
								? { ...b, blocks: spriteActions }
								: b.id === sprite.id
									? { ...b, blocks: activeActions }
									: b
						);

						setBlocks(updatedBlockActions);
						collisionDetected = true;
					}
				}

				if (collisionDetected) {
					setStageSprites(updatedSprites);
				}
			}
		}
	}, [stageSprites, selectedSprite]);

	const executeAction = async (action: BlockAction) => {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				setStageSprites((prevSprites) =>
					prevSprites.map((sprite) =>
						sprite.id === selectedSprite
							? (() => {
									switch (action.type) {
										case 'moveFront':
											return { ...sprite, x: sprite.x + Number(action.value) };
										case 'moveBack':
											return { ...sprite, x: sprite.x - Number(action.value) };
										case 'clockwise':
											return {
												...sprite,
												rotation: sprite.rotation + Number(action.value),
											};
										case 'anticlockwise':
											return {
												...sprite,
												rotation: sprite.rotation - Number(action.value),
											};
										case 'xPosition':
											return { ...sprite, x: Number(action.value) };
										case 'yPosition':
											return { ...sprite, y: Number(action.value) };
										default:
											return sprite;
									}
								})()
							: sprite
					)
				);
				resolve();
			}, 500); // Delay between actions
		});
	};

	const handleAddSprite = (sprite: Sprite) => {
		const count =
			stageSprites?.filter((i) => i.name === sprite.name).length || 0;
		const id = `${sprite.label}${count + 1}`;
		setStageSprites([
			...stageSprites,
			{
				...sprite,
				x: Math.random() * 500,
				y: Math.random() * 300,
				id: id,
			},
		]); // Add new sprite to playground

		setBlocks((prevSprites) => [...prevSprites, { id: id, blocks: [] }]); // Add new sprite to blockActions
	};

	const onRemoveSprite = (index: number) => {
		setStageSprites(stageSprites?.filter((_, i) => i !== index));
	};

	const handlePlayActions = async () => {
		setIsPlaying(true);
		for (const action of actionList) {
			await executeAction(action).catch((error) => {
				console.error('Error executing action:', error);
				handleCollision(); // Handle collision after each action
			}); // Execute each action sequentially
		}
		setIsPlaying(false); // Stop after all actions are done
		return true;
	};

	const handlePlayButtonClick = () => {
		handlePlayActions().catch((error) => {
			console.error('Error in handlePlayActions:', error);
		});
	};

	const handleSelectSprite = (id: string) => {
		setSelectedSprite(id);
	};

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		// setSelectedSprite(e.dataTransfer.getData('spriteID'))
		if (e.clientX === 0 && e.clientY === 0) return;
		const containerRect = containerRef?.current?.getBoundingClientRect();
		if (!containerRect) return;
		// console.log(containerRect?.left,containerRect?.top);
		// console.log(e.clientX, e.clientY);
		const mouseX = Math.max(e.clientX - containerRect?.left - 80 ,-40);
		const mouseY = Math.min(e.clientY - containerRect?.top - 80,260);
		console.log(mouseX, mouseY);
		setStageSprites((prevSprites) =>
			prevSprites.map((sprite) =>
				sprite.id === selectedSprite
					? { ...sprite, x: mouseX, y: mouseY }
					: sprite
			)
		);
	};

	useEffect(() => {
		// Add sprite on mount
		handleAddSprite({
			src: cat,
			name: 'Sprite 1',
			x: 0,
			label: 'Cat',
			y: 0,
			rotation: 0,
		});

		// Cleanup on unmount
		return () => {
			setStageSprites([]); // Clear stage sprites on unmount
		};
	}, []);

	return (
		<div className="p-4 h-[calc(100vh-80px)] bg-white">
			<div
				className="w-full p-10"
				style={{
					height: '400px',
					border: '1px solid black',
					position: 'relative',
				}}
				ref={containerRef}
			>
				{stageSprites?.map((sprite: StageSprites, index: number) => (
					<div
						key={index}
						className="relative"
						draggable={sprite.id===selectedSprite}
						onDragStart={(e) => {
							e.dataTransfer.setData('spriteID', sprite.id);
							setSelectedSprite(sprite.id)
						}}
						onDrag={handleDrag}
					
					>
						<sprite.src
							style={{
								position: 'absolute',
								left: `${sprite.x}px`,
								top: `${sprite.y}px`,
								transform: `rotate(${sprite.rotation}deg)`,

								width: '100px',
							}}
							aria-label={sprite.name}
						/>
						<button
							onClick={() => onRemoveSprite(index)}
							style={{
								position: 'absolute',
								background: 'red',
								color: 'white',
								border: 'none',
								borderRadius: '50%',
								width: '20px',
								height: '20px',
								fontSize: '12px',
								top: sprite.y,
								left: sprite.x,
								cursor: 'pointer',
							}}
						>
							X
						</button>
					</div>
				))}
			</div>
			<div className="py-2 font-medium text-left">
				Add character to Playground 
			</div>
			<div className="flex space-x-4 mb-4 h-10">
				{sprites.map((character, index) => (
					<button
						key={index}
						onClick={() => handleAddSprite(character)}
						className="flex flex-col items-center p-2 bg-blue-500 text-white rounded"
					>
						<span>{character.name}</span>
					</button>
				))}
				<button
					onClick={handlePlayButtonClick}
					disabled={isPlaying}
					className={` p-2 bg-green-500 text-white rounded`}
				>
					{isPlaying ? 'Playing...' : 'Play Actions'}
				</button>
			</div>
			<div className="py-2 font-medium text-left">Select character</div>
			<div className="flex space-x-4 mb-4">
				{stageSprites.map((character, index) => (
					<button
						key={index}
						onClick={() => handleSelectSprite(character.id)}
						className={`flex flex-col items-center p-2 ${character.id === selectedSprite ? 'bg-purple-500 scale-110 border-2 border-black' : 'bg-blue-500'} text-white rounded`}
					>
						<character.src width="50px" height="50px" />
						<span>{character.id}</span>
					</button>
				))}
			</div>
		</div>
	);
};

export default ViewArea;
