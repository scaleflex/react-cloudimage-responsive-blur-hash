import React, { Component, useEffect, useState, useRef, useMemo } from 'react';
import { findDOMNode } from 'react-dom';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredProps } from './utils.js';
import {blurHashImgStyes as styles} from "cloudimage-responsive-utils";
// import LazyLoad from 'react-lazyload';
import Canvas from './canvas';
import usePrevious from './hooks/usePrevious';
import { BASE_64_PLACEHOLDER } from 'cloudimage-responsive-utils/dist/constants';


function Img (props) {
  const { config = {}, src, blurhash } = props;
  
  const imgNode = useRef();
  const server = useMemo(() => isServer(), []);
  const previousProps = usePrevious({ innerWidth: config.innerWidth, src });

  const [state, setState] = useState({
    cloudimgURL: '',
    loaded: false,
    processed: false
  });

  const { lazyLoading: configLazyLoadingValue } = config;
  const { lazyLoading = configLazyLoadingValue } = props;
  const {
    height, ratio, cloudimgSRCSET, cloudimgURL, loaded, processed, previewLoaded, loadedImageRatio
  } = state;

  if (server) return <img alt={props.alt} src={BASE_64_PLACEHOLDER}/>;
  if (!processed) return <div/>;

  const {
    alt, className, lazyLoadConfig, preserveSize, imgNodeWidth, imgNodeHeight, doNotReplaceURL, ...otherProps
  } = getFilteredProps(props);

  const picture = (
    <div
      className={`${className} cloudimage-image ${loaded ? 'loaded' : 'loading'}`.trim()}
      style={styles.picture({
        preserveSize, imgNodeWidth, imgNodeHeight, ratio: ratio || loadedImageRatio, previewLoaded, loaded
      })}
    >
      {blurhash && <Canvas blurhash={blurhash} loaded={loaded}/>}

      <img
        ref={imgNode}
        style={styles.img()}
        src={cloudimgURL}
        srcSet={cloudimgSRCSET.map(({ dpr, url }) => `${url} ${dpr}x`).join(', ')}
        alt={alt}
        onLoad={onImgLoad}
        {...otherProps}
      />
    </div>
  );

  useEffect(() => {
    if (server) return;

    processImg();
  });

  useEffect(() => {
    if (!previousProps) return;

    if (previousProps.innerWidth !== innerWidth) {
      processImg(true, innerWidth > previousProps.innerWidth);
    }

    if (src !== previousProps.src) {
      processImg();
    }

  }, [innerWidth, src]);


  const processImg = (update, windowScreenBecomesBigger) => {
    const data = processReactNode(props, imgNode, update, windowScreenBecomesBigger, false);

    setState(data);
  }

  const updateLoadedImageSize = image => {
    setState((prev) => ({
      ...prev,
      loadedImageWidth: image.naturalWidth,
      loadedImageHeight: image.naturalHeight,
      loadedImageRatio: image.naturalWidth / image.naturalHeight
    }));
  }

  const onImgLoad = (event) => {
    updateLoadedImageSize(event.target)
    setLoaded(true);
  }

  return lazyLoading ? (
    <LazyLoad height={height} offset={config.lazyLoadOffset} {...lazyLoadConfig}>
      {picture}
    </LazyLoad>
  ) : picture;
}

export default Img;