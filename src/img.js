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
  const { lazyLoading: _lazyLoading, lazyLoadOffset, delay } = config;
  const { lazyLoading = _lazyLoading } = props;

  // console.log(props);

  const [loaded, setLoaded] = useState(false);
  const [data, setData] = useState({});

  const [loadedImageDim, setLoadedImageDim] = useState({});

  const imgNode = useRef();
  const server = useMemo(() => isServer(), []);
  const previousProps = usePrevious({ innerWidth: config.innerWidth, src });

  const {
    height, ratio, cloudimgSRCSET, cloudimgURL, processed, previewLoaded
  } = data;

  const {
    alt, 
    className, 
    lazyLoadConfig, 
    preserveSize, 
    imgNodeWidth,
    imgNodeHeight, 
    doNotReplaceURL,
    disableAnimation,
    innerRef,
    ...otherProps
  } = getFilteredProps(props);

  const processImg = (update, windowScreenBecomesBigger) => {
    const imageData = processReactNode(
      props,
      imgNode.current || imgNode.current.ref,
      update,
      windowScreenBecomesBigger,
      false
    );
    
    if (imageData) {
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

  const getCloudimgSRCSET = () => cloudimgSRCSET
  ?.map(({ dpr, url }) => `${url} ${dpr}x`).join(', ');

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
        {...(cloudimgSRCSET && {
          srcSet: getCloudimgSRCSET(),
        })}
        alt={alt}
        onLoad={onImgLoad}
        {...otherProps}
      />
    </div>
  );

  useEffect(() => {
    if (server || !(imgNode.current || imgNode.current?.ref)) return;

    if (typeof delay !== 'undefined') {
      setTimeout(() => {
        processImg();
      }, delay);
    } else {
      processImg();
    }

    innerRef.current = imgNode.current || imgNode.current.ref;
  }, []);

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

  if (server) return <img alt={alt} src={BASE_64_PLACEHOLDER}/>;

  if (!processed) return <div/>;

  return lazyLoading ? (
    <LazyLoad ref={imgNode} height={height} offset={lazyLoadOffset} {...lazyLoadConfig}>
      {picture}
    </LazyLoad>
  ) : picture;
}

export default Img;
