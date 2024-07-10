import { type BinaryOptions as BinPathOptions, getBinPath, getBinPathSync } from "get-bin-path";
import { isExecutable, isExecutableSync } from "is-executable";

/** The error thrown when a given binary cannot be resolved. */
export class BinaryPathNotFoundError extends Error {
	constructor() {
		super("Binary path not found!");
	}
}

/** The error thrown when a given binary is not executable or resolvable. */
export class BinaryNotExecutableError extends Error {
	constructor(path: string) {
		super(`Binary at path "${path}" not executable!`);
	}
}

/** Options used to resolve a binary. */
export type Options = BinPathOptions & {
	/**
	 * An optional mapping that resolves to a binary's path. This can be used to get the path of the source binary, for example.
	 *
	 * @param binPath The resolved binary path based on the given options and the current `package.json`.
	 * @returns A mapped binary path.
	 *
	 * @example
	 * map: binPath => binPath.replace("dist", "src").replace(".js", ".ts")
	 */
	map?: (binPath: string) => string;
};

/**
 * Resolves the path to an executable binary based on the given options and the current `package.json`.
 *
 * @throws {BinaryPathNotFoundError} Thrown if a binary path cannot be resolved from the given options and the current `package.json`.
 * @throws {BinaryNotExecutableError} Thrown if the (mapped) binary path is not executable or resolvable.
 */
export const getExecutableBinPath = async ({ map, ...binPathOptions }: Options = {}): Promise<string> => {
	const binPath = await getBinPath(binPathOptions);

	if (!binPath) {
		throw new BinaryPathNotFoundError();
	}

	const mappedBinPath = map ? map(binPath) : binPath;
	const isBinaryExecutable = await isExecutable(mappedBinPath);

	if (!isBinaryExecutable) {
		throw new BinaryNotExecutableError(mappedBinPath);
	}

	return mappedBinPath;
};

/**
 * Resolves the path to an executable binary based on the given options and the current `package.json`.
 *
 * @throws {BinaryPathNotFoundError} Thrown if a binary path cannot be resolved from the given options and the current `package.json`.
 * @throws {BinaryNotExecutableError} Thrown if the (mapped) binary path is not executable or resolvable.
 */
export const getExecutableBinPathSync = ({ map, ...binPathOptions }: Options = {}): string => {
	const binPath = getBinPathSync(binPathOptions);

	if (!binPath) {
		throw new BinaryPathNotFoundError();
	}

	const mappedBinPath = map ? map(binPath) : binPath;
	const isBinaryExecutable = isExecutableSync(mappedBinPath);

	if (!isBinaryExecutable) {
		throw new BinaryNotExecutableError(mappedBinPath);
	}

	return mappedBinPath;
};
