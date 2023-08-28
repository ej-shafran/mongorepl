# mongorepl

Meant to be a nice, light way to screw around with MongoDB, without the hassle of `mongosh` or a full fledged GUI.

## Setup

### Get Repository

Get the repository locally, either by cloning it (which means you get the git history of this repository) or using [`degit`](https://github.com/Rich-Harris/degit#degit-straightforward-project-scaffolding) (**recommended**).

```shell
$ npx degit ej-shafran/mongorepl
```

OR

```
$ git clone https://github.com/ej-shafran/mongorepl
```

If you're cloning using `git`, you'll probably want to add these lines to `.gitignore`, so you aren't tracking your workspace changes:

```
src/index.js
.env
out
```

### Install Dependencies

Use your preferred package manager - this package is built with [`pnpm`](https://pnpm.io), so it comes with a `pnpm-lock.yaml` file.

```shell
pnpm install
```

## Usage

### Workspace

The two files intended for use are `.env` and `src/index.js`. The former can be used to set environment variables which configure the REPL experience (see [configuration](#configuration)). The latter is the REPL itself.

Type into `src/index.js` as if it were a `mongosh` prompt, and use one of the scripts (described [below](#scripts)) to run it against your database.

```javascript
db.collection("users").findOne()
```

You should have auto-completion and everything, if your editor supports it.

Notice that you shouldn't have to:

- Import `db` or anything of the sort
- `await` the expression
- Log the output yourself

The `db` object is available within `src/index.js` with no need for an import, and so is the `ObjectId` class.

The file will be evaluated and run against the database for you when using any of the scripts.

It *is*, however, a regular JavaScript file - you can create variables, import from modules if needed, and the rest. It is important to know that the file should end with an expression that can be `await`ed if you want it to be properly output and displayed using the scripts. If you make multiple database/Mongo-related calls, you will need to `await` all of them but the last one.

```javascript
const projection = { _id: false, name: true };

// we *do* have to `await` this database access, since it's not the last one in the file
const result = await db.collection("users").findOne({}, { projection });

if (result) {
    // this is the result we want to output
    // here, we don't need `await` or `return`
    db.collection("otherUsers").findOne({ originalId: result._id }, projection);
} else {
    // since this expression can be `awaited`, it will be displayed
    // no need for `return` or `throw`
    "Could not read result"; 
}
```

### Scripts

There are several scripts you can use for different workflows.

#### `start`/`watch`

Starts the REPL in watch-mode. Will output the result of the REPL to STDOUT and re-run whenever `src/index.js` or `.env` are changed.

Note: all `watch` modes use [`nodemon`](https://www.npmjs.com/package/nodemon) behind the scenes, so you can use `rs` to re-run the process.

#### `once`

Runs the REPL once and outputs the result to STDOUT.

#### `tee`/`tee:watch`

Starts the REPL in `tee` mode - outputting the results of the REPL to STDOUT as well as to a file (by default, the file is `out`, but this can be configured with an environment variable or via passing a CLI argument). Re-runs whenever `src/index.js` or `.env` are changed, appending to the output file.

#### `tee:once`

Runs the REPL once, outputting the results to STDOUT as well as a file (cannot be configured like with `tee:watch`, but can be changed very easily in `package.json`).

### Configuration

Note: Any "boolean"-ish variables listed below treat `"true"`, `"yes"`, `"1"`, `"y"`, and `"on"` (case-insensitive) as `true` and any other value (including not being set) as `false`.

#### `MONGODB_DBNAME`

Sets the database name to use when creating the `db` global variable.

Can be omitted in favor of `MONGODB_URL`, or used in combination with it.

#### `MONGODB_URL`

Sets the full MongoDB URL to be used when creating the MongoDB connection. If none is set, defaults to `"mongodb://localhost:27017"`.

#### `DISABLE_COLOR`

Disables all color in the output of the REPL.

#### `LOG_PROMPT`

By default, `mongorepl` only outputs the result of the REPL. With this option it will also print the contents of `src/index.js`, separating the two with `PROMPT` and `RESULT` headers.

(**TODO:** maybe allow configuring the separators?)

#### `FULL_CURSOR`

By default, `mongorepl` will only print the first result of a MongoDB cursor (from an aggregation or a `Find`). When this is set to `true` the output will be the same as calling `.toArray` on the cursor.

#### `DISABLE_WARNINGS`

Turns off all warnings which could be printed by `mongorepl`.

#### `TEE_OUT`

Sets the output file for `tee:watch` mode. Takes precedence over a CLI argument.


## Customization

There's no hidden code - the entirety of the operation happens within `implementation/bin/main.js` (and inside the `implementation/scripts` directory for the different scripts). You're more than welcome to take a look if something bothers you and simply change it!
