# sequel-tag

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]


`sequel-tag` is a simple yet secure and powerful utility function for composing SQL queries in JavaScript or TypeScript.

## Features

- **Easy SQL Query Composition**: Compose SQL queries using template literals and parameterized values effortlessly.
- **Flexible Parameter Handling**: Pass a variety of parameter types, including strings, numbers, booleans, dates, null, undefined, and even objects!
- **SQL Injection Prevention**: Safeguard your queries against SQL injection attacks with built-in parameterization.
- **TypeScript Support**: Enjoy seamless integration with TypeScript, complete with type safety and intelligent autocompletion.
- **Debugging Made Fun**: Log or inspect the generated SQL script along with parameter values for easy debugging and troubleshooting.
- **Composable and Versatile**: Construct complex queries by combining multiple `sql` function calls, each representing a part of the overall query.

## Install

```bash
npm install sequel-tag
```

## Usage

```ts
import { sql } from 'sequel-tag';

const id = 1
const name = 'John Doe'
const department = 'IT'

sql`INSERT INTO users (id, name, department) VALUES (${id}, ${name}, ${department})`;
//=> {text: "INSERT INTO users (id, name, department) VALUES ($1, $2, $3)", values: [1, 'John Doe', 'IT']}
```

[build-img]:https://github.com/NikosTsompanides/sequel-tag/actions/workflows/release.yml/badge.svg
[build-url]:https://github.com/NikosTsompanides/sequel-tag/actions/workflows/release.yml
[downloads-img]:https://img.shields.io/npm/dt/sequel-tag
[downloads-url]:https://www.npmtrends.com/sequel-tag
[npm-img]:https://img.shields.io/npm/v/sequel-tag
[npm-url]:https://www.npmjs.com/package/sequel-tag
[issues-img]:https://img.shields.io/github/issues/NikosTsompanides/sequel-tag
[issues-url]:https://github.com/NikosTsompanides/issues
[codecov-img]:https://codecov.io/gh/NikosTsompanides/sequel-tag/branch/main/graph/badge.svg
[codecov-url]:https://codecov.io/gh/NikosTsompanides/sequel-tag
[semantic-release-img]:https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]:https://github.com/semantic-release/semantic-release
[commitizen-img]:https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]:http://commitizen.github.io/cz-cli/
