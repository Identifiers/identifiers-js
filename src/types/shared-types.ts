export const asIsCodec = {
  forIdentifier: (value: any) => value,
  toDebugString: (value: any) => JSON.stringify(value),
  encode: (value: any) => value,
  decode: (value: any) => value
};