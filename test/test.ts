import test, { type ThrowsExpectation } from "ava";
import type { RequireExactlyOne as OneOf } from "type-fest";
import {
	BinaryNotExecutableError,
	BinaryPathNotFoundError,
	getExecutableBinPath,
	getExecutableBinPathSync,
	type Options,
} from "../src/index.js";
import { atFixture } from "./_utils.js";

// dprint-ignore
type MacroArgs = [Options & OneOf<{
	expected: string;
	error: Pick<ThrowsExpectation<Error>, "instanceOf" | "message">;
}>];

const verify = test.macro<MacroArgs>(async (t, { expected, error, ...options }) => {
	if (error) {
		await t.throwsAsync(getExecutableBinPath(options), error);
		t.throws(() => getExecutableBinPathSync(options), error);
	} else {
		const binPath = await getExecutableBinPath(options);
		t.is(binPath, expected);

		const binPathSync = getExecutableBinPathSync(options);
		t.is(binPathSync, expected);
	}
});

for (const name of ["foo", "bar"]) {
	test(`multiple - ${name}`, verify, {
		name,
		cwd: atFixture("multiple-binaries"),
		expected: atFixture(`multiple-binaries/${name}.js`),
	});
}

test("not found", verify, {
	cwd: atFixture("multiple-binaries"),
	error: {
		instanceOf: BinaryPathNotFoundError,
		message: "Binary path not found!",
	},
});

test("not executable", verify, {
	cwd: atFixture("not-executable"),
	error: {
		instanceOf: BinaryNotExecutableError,
		message: `Binary at path "${atFixture("not-executable/cli.js")}" not executable!`,
	},
});

test("mapped", verify, {
	map: binPath => binPath.replace("dist", "src").replace(".js", ".ts"),
	cwd: atFixture("mapped-binary"),
	expected: atFixture("mapped-binary/src/cli.ts"),
});
