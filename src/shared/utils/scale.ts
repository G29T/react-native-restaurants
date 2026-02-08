import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Design baseline
const DESIGN_WIDTH = 375;
const DESIGN_HEIGHT = 812;

const WIDTH_SCALE = SCREEN_WIDTH / DESIGN_WIDTH;
const HEIGHT_SCALE = SCREEN_HEIGHT / DESIGN_HEIGHT;

export const scale = (size: number) => Math.round(size * WIDTH_SCALE);

export const verticalScale = (size: number) => Math.round(size * HEIGHT_SCALE);

// For: icons, mixed dimensions, borders etc.
export const moderateScale = (size: number, factor = 0.5) =>
  Math.round(size + (WIDTH_SCALE * size - size) * factor);


export const scaleFont = (size: number) => {
  const scaled = size * WIDTH_SCALE;

  return Math.round(
    Math.min(
      PixelRatio.roundToNearestPixel(scaled),
      size * 1.35 
    )
  );
};