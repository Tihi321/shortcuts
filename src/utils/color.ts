type TRgbaToCss =
  | {
      r: number;
      g: number;
      b: number;
      a: number;
    }
  | undefined;

export const hexToRgb = (hex: string, alpha: number = 1): TRgbaToCss => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: alpha,
      }
    : undefined;
};

export const rgbaToRgb = (rgba: string, alpha: number = 1): TRgbaToCss => {
  const result = /^rgba\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d*(?:\.\d+)?)\)$/.exec(
    rgba
  );

  return result
    ? {
        r: parseInt(result[1], 10),
        g: parseInt(result[2], 10),
        b: parseInt(result[3], 10),
        a: alpha,
      }
    : undefined;
};

export const colorToRGB = (color: string, alpha: number = 1): TRgbaToCss => {
  const rgbColor = /^rgba\((\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d*(?:\.\d+)?)\)$/.test(
    color
  );

  return rgbColor ? rgbaToRgb(color, alpha) : hexToRgb(color, alpha);
};

export const rgbaToCss = (props: TRgbaToCss) =>
  props && `rgba(${props.r}, ${props.g}, ${props.b}, ${props.a})`;

export const alpha = (color: string, alpha: number) => {
  return rgbaToCss(colorToRGB(color, alpha));
};

export const lighten = (color: string, amount: number) => {
  const { r, g, b } = colorToRGB(color) || { r: 0, g: 0, b: 0 };
  return `rgb(${r + amount}, ${g + amount}, ${b + amount})`;
};

export const darken = (color: string, amount: number) => {
  const { r, g, b } = colorToRGB(color) || { r: 0, g: 0, b: 0 };
  return `rgb(${r - amount}, ${g - amount}, ${b - amount})`;
};

export const brightenColor = (color: string, factor: number) => {
  const { r, g, b, a } = colorToRGB(color) || { r: 0, g: 0, b: 0 };
  const newR = Math.min(255, Math.max(0, Math.floor(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.floor(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.floor(b * factor)));
  return `rgba(${newR}, ${newG}, ${newB}, ${a})`;
};
