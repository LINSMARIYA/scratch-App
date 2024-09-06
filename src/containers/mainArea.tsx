import React, { useState } from 'react';

import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import Playground from '../components/playground';
import ViewArea from '../components/viewArea'

import { SpriteBlockType } from '../type';

const MainArea = () => {
	const [blocks, setBlocks] = useState<SpriteBlockType[]>([]);
	const [selectedSprite, setSelectedSprite] = useState<string>('Cat1');

	return (
		<>
			<div>
				<Navbar />
			</div>
			<div className='w-full flex gap-5 rounded-mds mt-[60px] h-full bg-[#e6eeff]'>
                <div className='w-[20%] h-full'>
				<Sidebar />
                </div>
                <div className='w-[40%] h-full'>
				<Playground spriteBlock={blocks} setBlocks={setBlocks} selectedSprite={selectedSprite} setSelectedSprite={setSelectedSprite} />
                </div>
                <div className='w-[40%] h-full'>
				<ViewArea blockActions={blocks} selectedSprite={selectedSprite} setBlocks={setBlocks} setSelectedSprite={setSelectedSprite}/>
                </div>
			</div>
		</>
	);
};

export default MainArea;
