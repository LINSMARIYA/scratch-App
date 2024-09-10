import React from 'react';
import {ReactComponent as Scratch} from '../assets/Scratch.svg'
const Navbar = () => {
  return (
    <div className='bg-[#855cd6] w-full py-5 px-4 top-0 left-0 fixed z-[100]'>
      <div className='flex gap-3'>
        <Scratch className='h-[30px]'/>
     
      </div>
    </div>
  );
}

export default Navbar;