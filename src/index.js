import './polyfills';
import React, {
  useContext, forwardRef, useCallback,
} from 'react';
import ImgComponent from './img';
import BackgroundImgComponent from './background';
import BlurHashComponent from './blurhash';
import CloudimageProvider, { CloudimageContext } from './provider';


const Img = forwardRef((props, ref) => {
  const cloudImageContext = useContext(CloudimageContext);

  const callbackRef = useCallback((node) => {
    if (node && ref) {
      ref.current = node;
    }
  }, []);

  return (
    <ImgComponent innerRef={callbackRef} {...props} config={cloudImageContext.cloudImageConfig} />
  );
});

const BackgroundImg = forwardRef((props, ref) => {
  const cloudImageContext = useContext(CloudimageContext);

  const callbackRef = useCallback((node) => {
    if (node && ref) {
      ref.current = node;
    }
  }, []);

  return (
    <BackgroundImgComponent innerRef={callbackRef} {...props} config={cloudImageContext.cloudImageConfig} />
  );
});

const BlurHash = forwardRef((props, ref) => {
  const cloudImageContext = useContext(CloudimageContext);

  const callbackRef = useCallback((node) => {
    if (node && ref) {
      ref.current = node;
    }
  }, []);

  return (
    <BlurHashComponent innerRef={callbackRef} {...props} config={cloudImageContext.cloudImageConfig} />
  );
});

export default Img;
export { CloudimageProvider, Img, BackgroundImg, BlurHash };
