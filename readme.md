# get-executable-bin-path

Get the current package's binary path and ensure it's executable.

Useful for making sure your CLIs are configured correctly.

## Install

```sh
npm install --save-dev get-executable-bin-path
```

<details>
<summary>Other Package Managers</summary>
<p>

```sh
yarn add --dev get-executable-bin-path
```

</p>
</details>

## Usage

```ts
import anyTest, { type TestFn } from "ava";
import { execa } from "execa";
import { getExecutableBinPath } from "get-executable-bin-path";

const test = anyTest as TestFn<{
	binPath: string;
}>;

test.before("setup context", async t => {
	t.context.binPath = await getExecutableBinPath();
});

test("main", async t => {
	const { stdout } = await execa(t.context.binPath);
	t.is(stdout, /* … */);
});
```

## API

### getExecutableBinPath(options?): `Promise<string>`

### getExecutableBinPathSync(options?): `string`

#### options

Type: `object`

##### name

Type: `string`\
Default: `package.json` `name` field

Name of the binary. See [`get-bin-path`](https://github.com/ehmicky/get-bin-path#optionsname) for more details.

##### cwd

Type: `string`\
Default: `process.cwd()`

Override the current directory. Used when retrieving the `package.json`.

##### map

Type: `(binPath: string) => string`

An optional mapping that resolves to a binary's path.

This can be used to get the path of the source binary, for example.

<details>
<summary>Example</summary>
<p>

```ts
const binPath = await getExecutableBinPath();
//=> "…/dist/cli.js"

const mappedBinPath = await getExecutableBinPath({
	map: binPath => binPath.replace("dist", "src").replace(".js", ".ts"),
});
//=> "…/src/cli.ts"
```

</p>
</details>

## BinaryPathNotFoundError

The error thrown when a given binary cannot be resolved.

## BinaryNotExecutableError

The error thrown when a given binary is not executable or resolvable.

## Related

- [get-bin-path](https://github.com/ehmicky/get-bin-path) - Get the current package's binary path.
- [bin-path-cli](https://github.com/tommy-mitchell/bin-path-cli) - Execute the current package's binary.
- [is-executable](https://github.com/sindresorhus/is-executable) - Check whether a file can be executed.
- [execa](https://github.com/sindresorhus/execa) - Process execution for humans.
