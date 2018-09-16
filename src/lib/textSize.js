const canvas = document.createElement('canvas');
const context = canvas.getContext("2d");


function getTextWidth(text, font) {
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

export default getTextWidth;