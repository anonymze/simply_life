/**
 * @description correctly type Object.keys
 */
export const getKeysTypedObject = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

/**
 * @description a text replacer which return a string with %s replaced by your values in order
 */
export const sprintf = (str: string, ...args: string[]) => {
	return args.reduce((acc, curr) => acc.replace(/%s/, curr), str);
};