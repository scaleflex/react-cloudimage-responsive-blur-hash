import React, { useState, useEffect } from 'react';
import { backgroundStyles as styles } from 'cloudimage-responsive-utils';
import Canvas from './canvas';

function BackgroundInner(props){
  const {
    cloudimgURL,
    className,
    style,
    children,
    blurhash,
    innerRef,
    ...otherProps
  } = props;

  const [loaded, setLoaded] = useState(false);

  const onImgLoad = () => {
    setLoaded(true);
  }

  const preLoadImg = () => {
    const img = new Image();

    img.onload = onImgLoad();
    img.src = cloudimgURL;
  }

  useEffect(() => {
    preLoadImg();
  },[]);

  return(
    <div
        {...otherProps}
        ref={innerRef}
        className={[className, 'cloudimage-background', `${loaded ? 'loaded' : 'loading'}`].join(' ').trim()}
        style={styles.container({ style, cloudimgURL })}
      >
        {blurhash && <Canvas blurhash={blurhash} loaded={loaded}/>}

        <div className="cloudimage-background-content" style={{ position: 'relative', zIndex: '2' }}>
          {children}
        </div>
      </div>
  );
}

export default BackgroundInner;
