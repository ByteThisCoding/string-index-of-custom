import { stringIndexOf } from "./index-of.mjs";
import { stringIndicesOf } from "./all-indices-of.mjs";

const FORWARD_TEST_CASES = [
    {
        //substring length one case
        subject: "abcdefg",
        substring: "b",
        expected: 1
    },
    {
        //simple test case
        subject: "abcdefg",
        substring: "bcd",
        expected: 1
    },
    {
        //simple test scase
        subject: "Byte This!",
        substring: "e T",
        expected: 3
    },
    {
        //not included test case
        subject: "Not included",
        substring: "abc",
        expected: -1
    },
    {
        //match is in last possible place
        subject: "Match at very end",
        substring: "end",
        expected: 14
    },
    {
        //match at zero
        subject: "at zero",
        substring: "at",
        expected: 0
    },
    {
        //match is entire substring
        subject: "entire string",
        substring: "entire string",
        expected: 0
    },
    {
        subject: "cacacab",
        substring: "cacab",
        expected: 2
    }
];

/**
 * Scenarios and edge cases:
 * : one match
 * : multiple matches
 * : substring === string
 * : substrings appear very close together
 */
const ALL_POS_TEST_CASES = [
    {
        //single letter match
        subject: "abaca",
        substring: "a",
        expected: [0, 2, 4]
    },
    {
        //multi char match
        subject: "the apple is the red one",
        substring: "the",
        expected: [0, 13]
    },
    {
        //full substring match
        subject: "abcdefg",
        substring: "abcdefg",
        expected: [0]
    },
    {
        //close proximity substring
        subject: "acacacb",
        substring: "acac",
        expected: [0, 2]
    }
];

let numFailed = 0;
FORWARD_TEST_CASES.forEach(tc => {
    const result = stringIndexOf(tc.subject, tc.substring);
    console.log({
        success: result === tc.expected ? "success" : "failure",
        ...tc,
        result
    });
    numFailed += result === tc.expected ? 0 : 1;
});

ALL_POS_TEST_CASES.forEach(tc => {
    const result = stringIndicesOf(tc.subject, tc.substring);

    let isEqual = result.length === tc.expected.length;
    for (let i=0; isEqual && i<result.length; i++) {
        isEqual = result[i] === tc.expected[i];
    }

    console.log({
        success: isEqual ? "success" : "failure",
        ...tc,
        result
    });
    numFailed += isEqual ? 0 : 1;
});

console.log(numFailed + " test cases failed");