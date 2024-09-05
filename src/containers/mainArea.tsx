import React, { useState } from 'react';

import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import Playground from '../components/playground';
import ViewArea from '../components/viewArea'


const MainArea = () => {
	const [blocks, setBlocks] = useState<
		{ type: string; value: string; x: number; y: number }[]
	>([]);

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
				<Playground {...{blocks, setBlocks}}/>
                </div>
                <div className='w-[40%] h-full'>
				<ViewArea blockActions={blocks}/>
              
                </div>
			</div>
		</>
	);
};

export default MainArea;
