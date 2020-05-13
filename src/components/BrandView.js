import React from 'react';
import LogoUpdate from './LogoUpdate';
import ColorPicker from './ColorPicker';

const BrandView = () => {
  return (
    <div className='brandWrapper'>
      <div className='headerWrapper'>
        <h2 className='welcomeHeader'>Almost Done</h2>
      </div>
      <div className='brandForms'>
        <LogoUpdate />
        <ColorPicker />
      </div>
      <button className='addBranding'>Finish</button>
    </div>
  );
};

export default BrandView;
