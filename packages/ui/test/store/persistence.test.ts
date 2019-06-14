import {select} from "../../src/store/persistence";

const state = {
  a: "A",
  b: {
    foo: "bar",
  },
  c: {
    one: "one",
    two: "two",
    three: {
      hello: 1,
      world: 2,
    },
  },
};

describe("persistence", () => {
  it("selects a single item", () => {
    const result = select(state, ["a"]);
    expect(result).toEqual({a: "A"});
  });

  it("selects multiple items", () => {
    const result = select(state, ["a", "b", "c"]);
    expect(result).toEqual(state);
  });

  it("selects a nested item", () => {
    const result = select(state, ["c.three.hello"]);
    expect(result).toEqual({
      c: {
        three: {
          hello: 1,
        },
      },
    });
  });

  it("selects a wildcard item", () => {
    const result = select(state, ["c.three.*"]);
    expect(result).toEqual({
      c: {
        three: {
          hello: 1,
          world: 2,
        },
      },
    });
  });
});
