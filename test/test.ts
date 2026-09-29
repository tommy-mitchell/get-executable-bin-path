import test, { type ThrowsExpectation } from "ava";
import type { RequireExactlyOne as OneOf } from "type-fest";
import {
	BinaryNotExecutableError,
	BinaryPathNotFoundError,
	getExecutableBinPath,
	getExecutableBinPathSync,
	type Options,
} from "../src/index.ts";
import { atFixture } from "./_utils.ts";

// dprint-ignore
type MacroArgs = [OneOf<{
	error: Pick<ThrowsExpectation<Error>, "instanceOf" | "message">;
	expected: string;
}> & Options];

const verify = test.macro<MacroArgs>(async (t, { error, expected, ...options }) => {
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
		cwd: atFixture("multiple-binaries"),
		expected: atFixture(`multiple-binaries/${name}.js`),
		name,
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
	cwd: atFixture("mapped-binary"),
	expected: atFixture("mapped-binary/src/cli.ts"),
	map: binPath => binPath.replace("dist", "src").replace(".js", ".ts"),
});
