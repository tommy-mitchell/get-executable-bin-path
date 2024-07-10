import { expectAssignable, expectType } from "tsd";
import {
	BinaryNotExecutableError,
	BinaryPathNotFoundError,
	getExecutableBinPath,
	getExecutableBinPathSync,
	type Options,
} from "../src/index.js";

const mapOption = { map: (binPath: string) => binPath.replace("dist", "src").replace(".js", ".ts") };
const nameOption = { name: "foo" };
const cwdOption = { cwd: "./fixtures" };

expectAssignable<Options>({});
expectAssignable<Options>({ map: () => "" });
expectAssignable<Options>(mapOption);
expectAssignable<Options>(nameOption);
expectAssignable<Options>(cwdOption);
expectAssignable<Options>({ ...mapOption, ...nameOption });
expectAssignable<Options>({ ...mapOption, ...cwdOption });
expectAssignable<Options>({ ...nameOption, ...cwdOption });
expectAssignable<Options>({ ...mapOption, ...nameOption, ...cwdOption });

expectType<Promise<string>>(getExecutableBinPath());
expectType<Promise<string>>(getExecutableBinPath({}));
expectType<Promise<string>>(getExecutableBinPath({ map: () => "" }));
expectType<Promise<string>>(getExecutableBinPath(mapOption));
expectType<Promise<string>>(getExecutableBinPath(nameOption));
expectType<Promise<string>>(getExecutableBinPath(cwdOption));
expectType<Promise<string>>(getExecutableBinPath({ ...mapOption, ...nameOption }));
expectType<Promise<string>>(getExecutableBinPath({ ...mapOption, ...cwdOption }));
expectType<Promise<string>>(getExecutableBinPath({ ...nameOption, ...cwdOption }));
expectType<Promise<string>>(getExecutableBinPath({ ...mapOption, ...nameOption, ...cwdOption }));

expectType<string>(getExecutableBinPathSync());
expectType<string>(getExecutableBinPathSync({}));
expectType<string>(getExecutableBinPathSync({ map: () => "" }));
expectType<string>(getExecutableBinPathSync(mapOption));
expectType<string>(getExecutableBinPathSync(nameOption));
expectType<string>(getExecutableBinPathSync(cwdOption));
expectType<string>(getExecutableBinPathSync({ ...mapOption, ...nameOption }));
expectType<string>(getExecutableBinPathSync({ ...mapOption, ...cwdOption }));
expectType<string>(getExecutableBinPathSync({ ...nameOption, ...cwdOption }));
expectType<string>(getExecutableBinPathSync({ ...mapOption, ...nameOption, ...cwdOption }));

expectType<typeof BinaryNotExecutableError>(BinaryNotExecutableError);
expectType<typeof BinaryPathNotFoundError>(BinaryPathNotFoundError);

const binaryNotExecutableError = new BinaryNotExecutableError("./fixtures/foo.js");
binaryNotExecutableError instanceof BinaryNotExecutableError; // eslint-disable-line @typescript-eslint/no-unused-expressions
expectType<BinaryNotExecutableError>(binaryNotExecutableError);

const binaryPathNotFoundError = new BinaryPathNotFoundError();
binaryPathNotFoundError instanceof BinaryPathNotFoundError; // eslint-disable-line @typescript-eslint/no-unused-expressions
expectType<BinaryPathNotFoundError>(binaryPathNotFoundError);
