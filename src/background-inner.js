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
    _ref,
    config,
    ...otherProps
  } = props;

  const [loaded, setLoaded] = useState(false);

  const { delay } = config;

  const onImgLoad = () => {
    setLoaded(true);
  }

  const preLoadImg = () => {
    const img = new Image();

    img.onload = onImgLoad();
    img.src = cloudimgURL;
  }

  const containerClassName = [
    className,
    'cloudimage-background',
    loaded ? 'loaded' : 'loading',
  ].join(' ').trim();

  useEffect(() => {
    if (typeof delay !== 'undefined') {
      setTimeout(() => {
        preLoadImg();
      }, delay);
    } else {
      preLoadImg();
    }
  }, []);

  return(
    <div
      {...otherProps}
      ref={_ref}
      className={containerClassName}
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
