import React, { useState } from 'react';
import Navbar from '../components/navbar';
import Sidebar from '../components/sidebar';
import Playground from '../components/playground';
import ViewArea from '../components/viewArea'


const MainArea = () => {
   
	return (
		<>
			<div>
				<Navbar />
			</div>
			<div className='w-full flex gap-5 rounded-mds mt-10 h-full bg-[#e6eeff]'>
                <div className='w-[20%] h-full'>
				<Sidebar />
                </div>
                <div className='w-[40%] h-full'>
				<Playground />
                </div>
                <div className='w-[40%] h-full'>
				<ViewArea/>
              
                </div>
			</div>
		</>
	);
};

export default MainArea;
