import anyTest, { type TestFn } from "ava";
import { execa } from "execa";
import { getExecutableBinPath } from "../src/index.ts";
import { atFixture } from "./_utils.ts";

const test = anyTest as TestFn<{
	binPath: string;
}>;

test.before("setup context", async t => {
	t.context.binPath = await getExecutableBinPath({ cwd: atFixture("mapped-binary") });
});

test("main", async t => {
	const { stdout } = await execa(t.context.binPath);
	t.is(stdout, "cli");
});
