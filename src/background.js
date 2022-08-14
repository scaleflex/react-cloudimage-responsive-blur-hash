import React, { Component, useEffect, useRef, useState, useMemo } from 'react';
import { findDOMNode } from 'react-dom';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredBgProps } from './utils.js';
// import LazyLoad from 'react-lazyload';
import { backgroundStyles as styles } from 'cloudimage-responsive-utils';
import usePrevious from './hooks/usePrevious';
import Canvas from './canvas';


function BackgroundImg (props){
  const { src } = props;

  const bgNode = useRef();
  const server = useMemo(() => isServer(),[]);
  
  const [state, setState] = useState({
    cloudimgURL: '', processed: false 
  });

  //there's no height in state!!
  const { height, processed, cloudimgURL } = state;

  const {
    alt, className, config, style, lazyLoadConfig,
    // lazyLoading = config.lazyLoading,
    lazyLoading = false,
    children, blurhash, doNotReplaceURL, ...otherProps
  } = getFilteredBgProps(props);

  const previousProps = usePrevious({ innerWidth: config.innerWidth, src });

  useEffect(() => {
    if (!previousProps) return;

    if (previousProps.innerWidth !== innerWidth) {
      processBg(true, innerWidth > previousProps.innerWidth);
    }

    if (src !== previousProps.src) {
      processBg();
    }

  }, [innerWidth, src]);

  const processBg = (update, windowScreenBecomesBigger) => {
    if(bgNode.current){
      const data = processReactNode(props, bgNode.current, update, windowScreenBecomesBigger, false);

      if (!data) {
        return;
      }
  
      setState(data);
    }
  }

  useEffect(() => {
    if (server) return;

    processBg();
  });

  if (server) return <div>{children}</div>;

  if (!processed && bgNode.current) return <div ref={bgNode}>{children}</div>;

  const Container = <BackgroundInner {...{ cloudimgURL, className, style, children, blurhash, otherProps }}/>;
  
  return lazyLoading ? (
    <LazyLoad height={height} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
      {Container}
    </LazyLoad>
  ) : Container;
}

function BackgroundInner(props){
  const { cloudimgURL, className, style, children, blurhash } = props;

  const [loaded, setLoaded] = useState(false);

  const onImgLoad = () => {
    setLoaded(true);
  }

  const preLoadImg = (cloudimgURL) => {
    const img = new Image();

    img.onload = onImgLoad();
    img.src = cloudimgURL;
  }

  useEffect(() => {
    preLoadImg(props.cloudimgURL);
  });

  return(
    <div
        // {...otherProps}
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

export default BackgroundImg;