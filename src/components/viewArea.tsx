import React, { useState } from 'react';

import { ReactComponent as cat } from '../assets/cat.svg';
import { ReactComponent as dog } from '../assets/dog.svg';

type BlockAction = { type: string; value: string; x: number; y: number };

const ViewArea = ({blockActions}: { blockActions: BlockAction[] }) =>
	{
		type Sprite = {
			src: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
			name: string;
			x: number;
			y: number;
			rotation:number
		};
		const [stageSprites, setStageSprites] = useState<Sprite[]>([]);
		const [isPlaying, setIsPlaying] = useState(false);
	
		const sprites = [
			{ src: cat, name: 'Sprite 1', x: 0, y: 0,rotation:0 },
			{ src: dog, name: 'Sprite 2', x: 0, y: 0,rotation:0 },
		];

		const executeAction = async (action: BlockAction) => {
			return new Promise<void>((resolve) => {
			  setTimeout(() => {
				setStageSprites((prevSprites) =>
				  prevSprites.map((sprite, index) => {
					  switch (action.type) {
						case 'moveFront':
						  return { ...sprite, x: sprite.x + Number(action.value) };
						case 'moveBack':
						  return { ...sprite, x: sprite.x - Number(action.value) };
						case 'clockwise':
						  return { ...sprite, rotation: sprite.rotation + Number(action.value) };
						case 'anticlockwise':
						  return { ...sprite, rotation: sprite.rotation - Number(action.value) };
						case 'xPosition':
						  return { ...sprite, x: Number(action.value) };
						case 'yPosition':
						  return { ...sprite, y: Number(action.value) };
						default:
						  return sprite;
					  }
					return sprite;
				  })
				);
				resolve();
			  }, 1000); // Delay between actions
			});
		  };



		const handleAddSprite = (sprite: Sprite) => {
			setStageSprites([
				...stageSprites,
				{ ...sprite, x: Math.random() * 500, y: Math.random() * 300 },
			]);
		};

		const onRemoveSprite = (index: number) => {
			setStageSprites(stageSprites.filter((_, i) => i !== index));
		};

		const handlePlayActions = async () => {
			setIsPlaying(true);
			for (const action of blockActions) {
			  await executeAction(action).catch((error) => {
				console.error('Error executing action:', error);
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
		  

		return (
			<div className="p-4 h-[calc(100vh-80px)] bg-white">
				<div
					className="w-full p-10"
					style={{
						height: '400px',
						border: '1px solid black',
						position: 'relative',
					}}
				>
					{stageSprites.map((sprite, index) => (
						<div key={index} className="relative">
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
					Add Charactes to playground
				</div>
				<div className="flex space-x-4 mb-4">
					{sprites.map((character, index) => (
						<button
							key={index}
							onClick={() => handleAddSprite(character)}
							className="flex flex-col items-center p-2 bg-blue-500 text-white rounded"
						>
							<character.src width="50px" height="50px" />
							<span>{character.name}</span>
						</button>
					))}
				</div>
				<button
					onClick={handlePlayButtonClick}
					disabled={isPlaying}
					className="mt-4 p-2 bg-green-500 text-white rounded"
				>
					{isPlaying ? 'Playing...' : 'Play Actions'}
				</button>
			</div>
		);
	};

export default ViewArea;
