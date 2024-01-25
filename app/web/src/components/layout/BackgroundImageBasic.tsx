import React from 'react';
import { BackgroundImage } from '@patternfly/react-core';
import background from '@assets/background.png';

const backgroundImageStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  position: 'fixed',
  zIndex: -1,
  top: 0,
  left: 0,
  margin:0, 
};

export const BackgroundImageBasic: React.FunctionComponent = () => (
  <div style={backgroundImageStyle}>
    <BackgroundImage src={background.src} />
  </div>
);
