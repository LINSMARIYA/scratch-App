import React from 'react'

import BlockWithInput from './blockInput'

const Sidebar = () => {
  return (
    <div className='p-4 h-[calc(100vh-80px)] bg-white'>


        <BlockWithInput  blockType="moveFront"  initialValue='10' />
        <BlockWithInput  blockType="clockwise"  initialValue='15' />
        <BlockWithInput  blockType="anticlockwise"  initialValue='15'/>
        <BlockWithInput  blockType="xPosition"  initialValue='10'/>
        <BlockWithInput  blockType="yPosition"  initialValue='25'/>
    </div>
  )
}

export default Sidebar