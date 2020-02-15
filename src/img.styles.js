const picture = ({ preserveSize, imgNodeWidth, imgNodeHeight, ratio, previewLoaded, loaded, placeholderBackground }) => ({
  width: preserveSize && imgNodeWidth ? imgNodeWidth : '100%',
  height: preserveSize && imgNodeHeight ? imgNodeHeight : 'auto',
  paddingBottom: preserveSize ? 'none' : (100 / ratio) + '%',
  position: 'relative',
  background: (!previewLoaded && !loaded) ? placeholderBackground : 'transparent',
});

const canvas = ({ loaded }) => ({
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '0',
  bottom: '0',
  left: '0',
  right: '0',
  opacity: loaded ? '0' : '1',
  zIndex: '1',
  transition: 'opacity 400ms ease 0ms'
});

const img = () => ({
  display: 'block',
  width: '100%',
  position: 'absolute',
  opacity: 1,
  top: 0,
  left: 0
});

export default { picture, canvas, img };