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
import Modal from './modal';

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
	const [collision, setIsCollision] = useState<string>('');
	const [isOpen, setIsOpen] = useState(false);
	const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

	const containerRef = useRef<HTMLDivElement>(null);

	const sprites = [
		{
			src: cat,
			name: 'Sprite 1',
			x: 0,
			label: 'Cat',
			y: 0,
			rotation: 0,
			w: 100,
			h: 89,
		},
		{
			src: dog,
			name: 'Sprite 2',
			x: 0,
			y: 0,
			label: 'Dog',
			rotation: 0,
			w: 100,
			h: 100,
		},
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

	const handleCollision = () => {
		const activeSprite = stageSprites.find(
			(sprite) => sprite.id === selectedSprite
		);
		const otherSprites = stageSprites.filter(
			(sprite) => sprite.id !== selectedSprite
		);
		const pathStart = {
			x: parseInt(initialPosition.x.toString()),
			y: parseInt(initialPosition.y.toString()),
		};
		if (!activeSprite) return;
		const pathEnd = {
			x: parseInt(activeSprite.x.toString()),
			y: parseInt(activeSprite.y.toString()),
		};

		otherSprites.forEach((otherDiv) => {
			const toleranceX = otherDiv.w / 2; // Horizontal tolerance
			const toleranceY = otherDiv.h / 2; // Vertical tolerance

			// Check if the activeSprite's x is within the horizontal range of otherDiv considering tolerance
			const hasSameX =
				otherDiv.x - toleranceX < activeSprite.x &&
				activeSprite.x < otherDiv.x + otherDiv.x + toleranceX;

			// Check if the activeSprite's y is within the vertical range of otherDiv considering tolerance
			const hasSameY =
				otherDiv.y - toleranceY < activeSprite.y &&
				activeSprite.y < otherDiv.y + otherDiv.y + toleranceY;
			if (hasSameX && hasSameY) {
				setIsCollision(otherDiv.id);
				setIsOpen(true);
			}
		});
	};

	const horizontalBoundary = (val: number) => {
		const mouseX = Math.min(Math.max(val, -40), 280);
		return mouseX;
	};

	const verticalBoundary = (val: number) => {
		const mouseY = Math.max(Math.min(val, 260), -40);
		return mouseY;
	};

	const moveDivForward = (
		div: { x: number; y: number },
		step: number,
		angle: number
	) => {
		// Convert angle from degrees to radians

		const angleInRadians = angle * (Math.PI / 180);

		// Calculate the change in x and y based on angle and step
		const deltaX = step * Math.cos(angleInRadians);
		const deltaY = step * Math.sin(angleInRadians);

		const newX = div.x + deltaX;
		const newY = div.y + deltaY;

		return { x: newX, y: newY };
	};

	const moveDivBackward = (
		div: { x: number; y: number },
		step: number,
		angle: number
	) => {
		// Convert angle from degrees to radians
		const angleInRadians = angle * (Math.PI / 180);

		const deltaX = -step * Math.cos(angleInRadians);
		const deltaY = -step * Math.sin(angleInRadians);

		const newX = div.x + deltaX;
		const newY = div.y + deltaY;

		return { x: newX, y: newY };
	};

	const executeAction = async (action: BlockAction) => {
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				setStageSprites((prevSprites) =>
					prevSprites.map((sprite) =>
						sprite.id === selectedSprite
							? (() => {
									const moveForward = moveDivForward(
										sprite,
										Number(action.value),
										sprite.rotation
									);
									const moveBackward = moveDivBackward(
										sprite,
										Number(action.value),
										sprite.rotation
									);
									switch (action.type) {
										case 'moveFront':
											return {
												...sprite,
												x: horizontalBoundary(moveForward.x),
												y: verticalBoundary(moveForward.y),
											};
										case 'moveBack':
											return {
												...sprite,
												x: horizontalBoundary(moveBackward.x),
												y: verticalBoundary(moveBackward.y),
											};
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
											return {
												...sprite,
												x: horizontalBoundary(Number(action.value)),
											};
										case 'yPosition':
											return {
												...sprite,
												y: verticalBoundary(Number(action.value)),
											};
										default:
											return sprite;
									}
								})()
							: sprite
					)
				);
				handleCollision();
				if (collision) {
					console.log("herre")
					interchangeActions(selectedSprite, collision);
					
				}
				resolve();
			}, 10); // Delay between actions
		});
	};

	const interchangeActions = (id1: string, id2: string) => {
		setBlocks((prevSprites) => {
			const sprite1 = prevSprites.find((sprite) => sprite.id === id1);
			const sprite2 = prevSprites.find((sprite) => sprite.id === id2);

			if (!sprite1 || !sprite2) return prevSprites;

			const updatedSprites = prevSprites.map((sprite) => {
				if (sprite.id === id1) {
					return { ...sprite, blocks: sprite2.blocks };
				} else if (sprite.id === id2) {
					return { ...sprite, blocks: sprite1.blocks };
				} else {
					return sprite;
				}
			});

			return updatedSprites;
		});
		setIsCollision('');
	};

	const stopAnimation = () => {
		setIsPlaying(false);
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
				h: sprite.h,
				w: sprite.w,
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
		const activeSprite = stageSprites.find(
			(sprite) => sprite.id === selectedSprite
		);
		if (!activeSprite) return;
		setInitialPosition({ x: activeSprite?.x, y: activeSprite?.y });
		for (const action of actionList) {
			await executeAction(action).catch((error) => {
				console.error('Error executing action:', error);
				// Handle collision after each action
			});
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

		if (e.clientX === 0 && e.clientY === 0) return;
		const containerRect = containerRef?.current?.getBoundingClientRect();
		if (!containerRect) return;

		const mouseX = Math.min(
			Math.max(e.clientX - containerRect?.left - 80, -40),
			280
		);
		const mouseY = Math.max(
			Math.min(e.clientY - containerRect?.top - 80, 260),
			-40
		);
		setStageSprites((prevSprites) =>
			prevSprites.map((sprite) =>
				sprite.id === selectedSprite
					? { ...sprite, x: mouseX, y: mouseY }
					: sprite
			)
		);
	};

	const onSpriteDragStart = (
		e: React.DragEvent<HTMLDivElement>,
		spriteId: string
	) => {
		e.dataTransfer.setData('spriteID', spriteId);
		setSelectedSprite(spriteId);

		// Set the invisible element as the drag image
		const invisibleElement = document.createElement('div');
		invisibleElement.style.width = '0px';
		invisibleElement.style.height = '0px';
		document.body.appendChild(invisibleElement);
		e.dataTransfer.setDragImage(invisibleElement, 0, 0);
	};

	useEffect(() => {
		setStageSprites([
			{
				src: cat,
				name: 'Sprite 1',
				x: 0,
				id: 'Cat1',
				y: 0,
				rotation: 0,
				h: 100,
				w: 80,
			},
		]);
		setBlocks(() => [{ id: 'Cat1', blocks: [] }]);
		setSelectedSprite('Cat1');

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
						draggable
						onDragStart={(e) => onSpriteDragStart(e, sprite.id)}
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
			<Modal
				text="Collision between sprites detected"
				isVisible={isOpen}
				onClickClose={() => setIsOpen(false)}
				autoCloseTime={2000}
			></Modal>
		</div>
	);
};

export default ViewArea;
