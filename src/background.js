import React, { useEffect, useRef, useState, useMemo } from 'react';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredBgProps } from './utils.js';
// import LazyLoad from 'react-lazyload';
import BackgroundInner from './background-inner';
import usePrevious from './hooks/usePrevious';


function BackgroundImg (props){
  const { config = {}, src } = props;

  const [data, setData] = useState({});

  const bgNode = useRef();
  const server = useMemo(() => isServer(),[]);

  const {
    height, cloudimgURL, processed,
  } = data;

  const processBg = (update, windowScreenBecomesBigger) => {
    if(bgNode.current){
      const bgData = processReactNode(
        props,
        bgNode.current,
        update,
        windowScreenBecomesBigger,
        false,
      );
  
      if (bgData) {
        setData(bgData);
      }
    }
  }

  const {
    alt,
    className,
    style,
    lazyLoadConfig,
    // lazyLoading = config.lazyLoading,
    lazyLoading = false,
    children,
    blurhash,
    innerRef,
    doNotReplaceURL,
    ...otherProps
  } = getFilteredBgProps(props);

  useEffect(() => {
    if (server) return;

    processBg();
  }, []);

  const containerProps = {
    cloudimgURL,
    className,
    style,
    children,
    blurhash,
    ...otherProps,
  };

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

  const Container = <BackgroundInner innerRef={innerRef} {...containerProps}/>;
 
  if (server) return <div>{children}</div>;

  if (!processed && bgNode.current) return <div ref={bgNode}>{children}</div>;

  return lazyLoading ? (
    <LazyLoad 
      height={height} 
      offset={config.lazyLoadOffset} 
      {...lazyLoadConfig}
    >
      {Container}
    </LazyLoad>
  ) : Container;
}

export default BackgroundImg;
