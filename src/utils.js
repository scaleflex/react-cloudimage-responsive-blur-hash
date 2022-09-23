export const getFilteredProps = ({
  config = {}, alt = '', className = '', src, sizes, width, 
  height, params, lazyLoading, blurhash, ratio, ...otherProps
}) => ({
  alt,
  className,
  imgNodeWidth: width,
  imgNodeHeight: height,
  ...otherProps,
});

export const getFilteredBgProps = ({
  config = {}, alt = '', className = '', src, sizes, width,
  height, blurhash, ratio, params, ...otherProps
}) => ({
  config,
  blurhash,
  alt,
  className,
  ...otherProps
});
