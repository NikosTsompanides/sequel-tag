import { sql } from '../src/index';

describe('sql', () => {
  test('returns the proper sql query and the values array', () => {
    const id = 1;
    const name = 'John';
    const department = {
      id: 2,
      title: 'Sales',
    };

    const res = sql`INSERT INTO users (id, name, department) VALUES (${id}, ${name}, ${department})`;

    expect(res.values).toStrictEqual([id, name, department]);
    expect(res.text).toMatchInlineSnapshot(
      '"INSERT INTO users (id, name, department) VALUES ($1, $2, $3)"'
    );
  });

  test('handles no parameters', () => {
    const { text, values } = sql`SELECT * FROM users`;
    expect(text).toBe('SELECT * FROM users');
    expect(values).toEqual([]);
  });

  test('handles empty strings array', () => {
    const { text, values } = sql``;
    expect(text).toBe('');
    expect(values).toEqual([]);
  });

  test('handles a single parameter', () => {
    const { text, values } = sql`SELECT * FROM users WHERE id = ${1}`;
    expect(text).toBe('SELECT * FROM users WHERE id = $1');
    expect(values).toEqual([1]);
  });

  test('handles special characters in strings', () => {
    const {
      text,
      values,
    } = sql`SELECT * FROM users WHERE name = ${"O'Reilly"} AND dept = ${"D'Angelo"}`;
    expect(text).toBe('SELECT * FROM users WHERE name = $1 AND dept = $2');
    expect(values).toEqual(["O'Reilly", "D'Angelo"]);
  });

  test('handles mismatched lengths', () => {
    const {
      text,
      values,
    } = sql`SELECT * FROM users WHERE id = ${1} AND name = ${'John'}`;
    expect(text).toBe('SELECT * FROM users WHERE id = $1 AND name = $2');
    expect(values).toEqual([1, 'John']);
  });

  test('handles null or undefined parameters', () => {
    const {
      text,
      values,
    } = sql`SELECT * FROM users WHERE id = ${null} AND name = ${undefined}`;
    expect(text).toBe('SELECT * FROM users WHERE id = $1 AND name = $2');
    expect(values).toEqual([null, undefined]);
  });

  test('handles array parameters', () => {
    const ids = [1, 2, 3];
    const { text, values } = sql`SELECT * FROM users WHERE id = ANY(${ids})`;
    expect(text).toBe('SELECT * FROM users WHERE id = ANY($1)');
    expect(values).toEqual([ids]);
  });

  test('handles mixed data types', () => {
    const {
      text,
      values,
    } = sql`SELECT * FROM users WHERE active = ${true} AND score > ${4.5} AND last_login = ${new Date(
      '2023-01-01'
    )}`;
    expect(text).toBe(
      'SELECT * FROM users WHERE active = $1 AND score > $2 AND last_login = $3'
    );
    expect(values).toEqual([true, 4.5, new Date('2023-01-01')]);
  });

  test('handles empty parameters', () => {
    const {
      text,
      values,
    } = sql`SELECT * FROM users WHERE name = ${''} AND age = ${0}`;
    expect(text).toBe('SELECT * FROM users WHERE name = $1 AND age = $2');
    expect(values).toEqual(['', 0]);
  });

  test('handles complex SQL with subqueries', () => {
    const userId = 42;
    const {
      text,
      values,
    } = sql`SELECT * FROM orders WHERE user_id = ${userId} AND order_id IN (SELECT order_id FROM order_items WHERE product_id = ${99})`;
    expect(text).toBe(
      'SELECT * FROM orders WHERE user_id = $1 AND order_id IN (SELECT order_id FROM order_items WHERE product_id = $2)'
    );
    expect(values).toEqual([userId, 99]);
  });

  test('handles long queries with many parameters', () => {
    const valuesList = Array.from({ length: 10 }, (_, i) => i + 1);
    const { text, values } = sql`
      INSERT INTO big_table (col1, col2, col3, col4, col5, col6, col7, col8, col9, col10)
      VALUES (${valuesList[0]}, ${valuesList[1]}, ${valuesList[2]}, ${valuesList[3]}, ${valuesList[4]}, ${valuesList[5]}, ${valuesList[6]}, ${valuesList[7]}, ${valuesList[8]}, ${valuesList[9]})
    `;
    expect(text).toBe(`
      INSERT INTO big_table (col1, col2, col3, col4, col5, col6, col7, col8, col9, col10)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `);
    expect(values).toEqual(valuesList);
  });

  test('handles conditional logic', () => {
    const isActive = true;
    const { text, values } = sql`SELECT * FROM users WHERE active = ${
      isActive ? 1 : 0
    }`;
    expect(text).toBe('SELECT * FROM users WHERE active = $1');
    expect(values).toEqual([1]);
  });

  test('handles UPDATE statements', () => {
    const age = 30;
    const userId = 1;
    const {
      text,
      values,
    } = sql`UPDATE users SET age = ${age} WHERE id = ${userId}`;
    expect(text).toBe('UPDATE users SET age = $1 WHERE id = $2');
    expect(values).toEqual([age, userId]);
  });

  test('handles DELETE statements', () => {
    const userId = 1;
    const { text, values } = sql`DELETE FROM users WHERE id = ${userId}`;
    expect(text).toBe('DELETE FROM users WHERE id = $1');
    expect(values).toEqual([userId]);
  });

  test('handles LIMIT and OFFSET clauses', () => {
    const limit = 10;
    const offset = 20;
    const {
      text,
      values,
    } = sql`SELECT * FROM users LIMIT ${limit} OFFSET ${offset}`;
    expect(text).toBe('SELECT * FROM users LIMIT $1 OFFSET $2');
    expect(values).toEqual([limit, offset]);
  });

  test('handles empty arrays as parameters', () => {
    const emptyArray: number[] = [];
    const {
      text,
      values,
    } = sql`SELECT * FROM users WHERE id = ANY(${emptyArray})`;
    expect(text).toBe('SELECT * FROM users WHERE id = ANY($1)');
    expect(values).toEqual([emptyArray]);
  });

  test('handles multiple parameters in the same part of the string', () => {
    const firstName = 'John';
    const lastName = 'Doe';
    const {
      text,
      values,
    } = sql`SELECT * FROM users WHERE first_name = ${firstName} AND last_name = ${lastName}`;
    expect(text).toBe(
      'SELECT * FROM users WHERE first_name = $1 AND last_name = $2'
    );
    expect(values).toEqual([firstName, lastName]);
  });

  test('handles error-prone symbols in strings', () => {
    const {
      text,
      values,
    } = sql`SELECT * FROM users WHERE name = ${"Robert'); DROP TABLE students;--"}`;
    expect(text).toBe('SELECT * FROM users WHERE name = $1');
    expect(values).toEqual(["Robert'); DROP TABLE students;--"]);
  });

  test('handles JavaScript BigInt', () => {
    const bigIntValue = BigInt(9007199254740991);
    const {
      text,
      values,
    } = sql`SELECT * FROM big_numbers WHERE big_int = ${bigIntValue}`;
    expect(text).toBe('SELECT * FROM big_numbers WHERE big_int = $1');
    expect(values).toEqual([bigIntValue]);
  });

  test('prevents SQL injection', () => {
    const maliciousInput = "'; DROP TABLE users;--";
    const {
      text,
      values,
    } = sql`SELECT * FROM users WHERE name = ${maliciousInput}`;
    expect(text).toBe('SELECT * FROM users WHERE name = $1');
    expect(values).toEqual([maliciousInput]);
  });

  // Edge cases for Handling of Reserved Keywords
  test('handles reserved keywords', () => {
    const {
      text,
      values,
    } = sql`SELECT * FROM "select" WHERE "from" = ${'where'}`;
    expect(text).toBe('SELECT * FROM "select" WHERE "from" = $1');
    expect(values).toEqual(['where']);
  });

  // Edge cases for Handling of Large Parameter Arrays
  test('handles large parameter arrays', () => {
    const largeArray = Array.from({ length: 1000 }, (_, i) => i + 1);
    const {
      text,
      values,
    } = sql`SELECT * FROM large_table WHERE id = ANY(${largeArray})`;
    expect(text).toBe('SELECT * FROM large_table WHERE id = ANY($1)');
    expect(values).toEqual([largeArray]);
  });

  // Edge cases for Handling of Very Large BigIntegers
  test('handles very large BigIntegers', () => {
    const bigIntValue = BigInt(Number.MAX_SAFE_INTEGER) + BigInt(1);
    const {
      text,
      values,
    } = sql`SELECT * FROM big_numbers WHERE big_int = ${bigIntValue}`;
    expect(text).toBe('SELECT * FROM big_numbers WHERE big_int = $1');
    expect(values).toEqual([bigIntValue]);
  });
});
