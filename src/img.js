import React, { useEffect, useState, useRef, useMemo } from 'react';
import { isServer, processReactNode } from 'cloudimage-responsive-utils';
import { getFilteredProps } from './utils.js';
import {blurHashImgStyes as styles} from "cloudimage-responsive-utils";
// import LazyLoad from 'react-lazyload';
import Canvas from './canvas';
import usePrevious from './hooks/usePrevious';
import { BASE_64_PLACEHOLDER } from 'cloudimage-responsive-utils/dist/constants';


function Img (props) {
  const { config = {}, src, blurhash } = props;

  const [loaded, setLoaded] = useState(false);
  const [processed, setProcessed] = useState(false);
  const [previewLoaded, setPreviewLoaded] = useState(false);
  const [cloudimgURL, setCloudimgURL] = useState('');
  const [loadedImageDim, setLoadedImageDim] = useState({});
  const [data, setData] = useState({});

  const imgNode = useRef();
  const server = useMemo(() => isServer(), []);
  const previousProps = usePrevious({ innerWidth: config.innerWidth, src });

  const { lazyLoading: configLazyLoadingValue, lazyLoadOffset } = config;
  const { lazyLoading = configLazyLoadingValue } = props;
  const {
    height, ratio, cloudimgSRCSET,
  } = data;

  const {
    alt, 
    className, 
    lazyLoadConfig, 
    preserveSize, 
    imgNodeWidth,
    imgNodeHeight, 
    doNotReplaceURL, 
    ...otherProps
  } = getFilteredProps(props);

  const { innerRef } = otherProps;

  const processImg = (update, windowScreenBecomesBigger) => {
    const imageData = processReactNode(
      props,
      imgNode.current,
      update,
      windowScreenBecomesBigger,
      false
    );
    
    if (imageData) {
      console.log(imageData);
      setData(imageData);
    }
  };

  const updateLoadedImageSize = (image) => {
    setLoadedImageDim({
      width: image.naturalWidth,
      height: image.naturalHeight,
      ratio: image.naturalWidth / image.naturalHeight
    });
  }

  const onImgLoad = (event) => {
    updateLoadedImageSize(event.target)
    setLoaded(true);
  }

  const pictureClassName = `${className} cloudimage-image ${loaded ? 'loaded' : 'loading'}`
    .trim();
  
  const pictureStyles = styles.picture({
    preserveSize,
    imgNodeWidth,
    imgNodeHeight,
    ratio: ratio || loadedImageDim.ratio,
    previewLoaded,
    loaded
  });

  const picture = (
    <div
      className={pictureClassName}
      style={pictureStyles}
      ref={imgNode}
    >
      {blurhash && <Canvas blurhash={blurhash} loaded={loaded}/>}

      <img
        ref={innerRef}
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
    if (!previousProps) return;

    if (previousProps.innerWidth !== innerWidth) {
      processImg(
        true,
        innerWidth > previousProps.innerWidth
      );
    }

    if (src !== previousProps.src) {
      processImg();
    }
  }, [innerWidth, src]);

  useEffect(() => {
    if (server) return;

    processImg();
  }, []);

  if (server) return <img alt={props.alt} src={BASE_64_PLACEHOLDER}/>;

  if (!processed) return <div/>;

  return lazyLoading ? (
    <LazyLoad height={height} offset={lazyLoadOffset} {...lazyLoadConfig}>
      {picture}
    </LazyLoad>
  ) : picture;
}

export default Img;
