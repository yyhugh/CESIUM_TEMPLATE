enum ANCHOR_POINT {
  LEFT_TOP = 1,
  CENTER_TOP = 2,
  RIGHT_TOP = 3,
  LEFT_MIDDLE = 4,
  CENTER_MIDDLE = 5,
  RIGHT_MIDDLE = 6,
  LEFT_BOTTOM = 7,
  CENTER_BOTTOM = 8,
  RIGHT_BOTTOM = 9,
}

export default {
  Anchor: Object.freeze(ANCHOR_POINT),
  getOffset,
};

/**
 * 计算锚点偏移量
 * @param anchor 想要的锚点位置
 * @param w 宽度
 * @param h 高度
 * @param digit 保留小数位
 */
function getOffset(anchor: ANCHOR_POINT, w: number, h: number, digit = 2) {
  let x = 0,
    y = 0;
  if (anchor === ANCHOR_POINT.CENTER_BOTTOM) {
    x = w / 2;
    y = h;
  } else if (anchor === ANCHOR_POINT.CENTER_MIDDLE) {
    x = w / 2;
    y = h / 2;
  } else if (anchor === ANCHOR_POINT.CENTER_TOP) {
    x = w / 2;
  } else if (anchor === ANCHOR_POINT.LEFT_MIDDLE) {
    y = h / 2;
  } else if (anchor === ANCHOR_POINT.LEFT_BOTTOM) {
    y = h;
  } else if (anchor === ANCHOR_POINT.RIGHT_TOP) {
    x = w;
  } else if (anchor === ANCHOR_POINT.RIGHT_MIDDLE) {
    x = w;
    y = h / 2;
  } else if (anchor === ANCHOR_POINT.RIGHT_BOTTOM) {
    x = w;
    y = h;
  } else if (anchor === ANCHOR_POINT.LEFT_TOP) {
    x = 0;
    y = 0;
  }
  return {
    x: -1 * Number.parseFloat(x.toFixed(digit)),
    y: -1 * Number.parseFloat(y.toFixed(digit)),
  };
}
