import React, { useState } from 'react';

import { ReactComponent as cat } from '../assets/cat.svg';
import { ReactComponent as dog } from '../assets/dog.svg';

const ViewArea = () => {
  type Sprite = {
    src: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    name: string;
    x: number;
    y: number;
};
const [stageSprites, setStageSprites] = useState<Sprite[]>([]);

const sprites = [
  { src: cat, name: 'Sprite 1' , x: 0, y: 0},
  { src: dog, name: 'Sprite 2', x: 0, y: 0 },
];

const handleAddSprite = (sprite: Sprite) => {
    setStageSprites([
      ...stageSprites,
      { ...sprite, x: Math.random() * 500, y: Math.random() * 300 },
    ]);
  };
	return (
		<div className="p-4 h-[calc(100vh-40px)] bg-white">
			<div
				className="w-full"
				style={{
					height: '400px',
					border: '1px solid black',
					position: 'relative',
				}}
			>
			 {stageSprites.map((sprite, index) => (
        <sprite.src
          key={index}
          style={{
            position: 'absolute',
            top: sprite.y,
            left: sprite.x,
            width: '100px',
          }}
          aria-label={sprite.name}
        />
      ))}
			</div>
        <div className='py-2 font-medium text-left'>Add Charactes to playground</div>
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
		</div>
	);
};

export default ViewArea;
