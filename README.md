# string-index-of-custom
A custom implementation of "string.indexOf" which explores how to code this functionality from scratch. Feel free to also take a look at our [Dev Page](https://bytethisstore.com/articles/pg/js-str-index-of), where we cover this topic in a bit more detail.

## Problem Statement
> Write a function that will receive a subject string and substring as arguments and return the position of the first occurence of the substring in the subject string, or -1 if it does not exist.

In other words, we will need to write a function which behaves in exactly the same way as the common ``String.indexOf`` type methods built into most common programming languages. We'll want to make our implementation as efficient as possible; we don't want to make redundant comparisons.

## Analysis
Let's begin our analysis by asking the question: which positions are *impossible* for the substring to appear in? If we use an example of a subject "impossible" and substring "possible", we can see that the substring could only possibly appear in index 0, 1, or 2. If we try to check any position afterwords, we will see that there is not enough space left in the string "impossible" for it to fit the substring "possible". This fact is suggestive of a possible approach we can take.

To determine the position of the first substring, we can iterate possible **start positions** from ``0`` up to ``subject.length - substring.length``. While we iterate, we can keep track of a *possible* start position. When we find the first character in the subject which equals the first character in the substring, we've found a possible start position. In subsequent character iterations over the subject, we can check the ``nth`` character of the substring to the ``ith`` position of the subject, where ``n = i - possibleStartPos``. If we reach a point where ``n === substring.length``, then each character before has matched, thus we have a full substring match. Otherwise, if we reach a point where ``substring[n] !== subject[i]``, the substring match is broken and the possible start position needs to be reset.

## Implementing a Basic Solution
If we write a function which utilizes the approach discussed above, it will look something like this:
```javascript
/**
 * Get the first position the string "substring" appears in the string "subject"
 * If not found, return -1
 * NOTE: this is an example approach and does not cover all edge cases (to be covered in sections below)
 * @param subject : the string to test the substring upon
 * @param substring 
 */
export function stringIndexOf(subject, substring) {
    //we'll have match start index record the current working start of the substring in string
    //if we find it is not a match, we'll set matchStartIndex to the next char index

    //check if the first characters of each string match
    let matchStartIndex = substring[0] === subject[0] ? 0 : 1;

    //start at pos=1 of the subject string and increment from there
    const diff = subject.length - substring.length;
    for (let i=1; i<subject.length && matchStartIndex <= diff; i++) {
        //get the position in the substring to compare to the main string at "i"
        const substrPos = i - matchStartIndex;

        //if the substringPos is out of bounds, we know we've found our match
        if (substrPos === substring.length) {
            return matchStartIndex;
        } else if (substring[substrPos] !== subject[i]) {
            //if the characters don't match, reset the start index
            matchStartIndex = i + 1;
        }
    }

    return -1;
}
```
To summarize, the function will:
1. Initially check if the first characters of each string match. If so, put the start match index there. Otherwise, put it at 1.
1. For each character in the subject starting with index 1:
    1. Get the offset of the substring to compare.
    1. If we've reached the end of the substring, return the current match start position.
    1. Otherwise, compare if to the offset of the subject string. If they don't match, set the match start index to the next position.
1. If a solution is not found, return -1.

This approach will generally work, but there are certain edge cases where it will fail. In the section below, we'll analyze all of the edge cases and see which ones are not covered by the code above.

## Identifying Edge Cases
There are a few different **edge cases**, cases which are uncommon or extreme in some sense, which we must account for. We need to consider different types of inputs where:
1. The substring starts at position 0.
2. The substring starts at the last possible position of the subject.
3. The subject does not contain the substring at all.
4. The subject contains the substring in more than one position.
5. The substring contains a repeated sub-pattern and the subject contains that repeated pattern. For example: the substring is ``cacab`` and the subject is ``cacacab``.

The code implementation above will definitely fail in cases 2 and 5. In order to account for those edge cases, we'll need to modify our implementation.

## Refining the Solution
In order to check if the substring is in the last possible position, we can add one additional check after the loop to see if the current match start index is itself the last possible position. If it is, we'll know that we've found our match, but the loop ended before the return condition, so we can return at that point instead.

To check for the repeated sub-pattern, we'll need to change the way we track possible match start indices. Before, it failed to track the sub-pattern case because the actual substring index occured after the match start index but before the match itself was determined to have failed. In order to compensate for this, we'll need to enhance our code to track multiple possible starting positions, then track for each one at each index. In the code below, we'll do so by using a set. As we find possible start positions, we'll add to the set. When we rule out positions, we'll delete them. If we've found a match, we'll return the position immediately:
```javascript
export function stringIndexOf(subject, substring) {
    const matchStartIndices = new Set();
    if (substring[0] === subject[0]) {
        matchStartIndices.add(0);
    }

    //start at pos=1 of the subject string and increment from there
    for (let i = 1; i < subject.length; i++) {
        for (const matchStartIndex of matchStartIndices) {
            //get the position in the substring to compare to the main string at "i"
            const substrPos = i - matchStartIndex;

            //if the substringPos is out of bounds, we know we've found our match
            if (substrPos === substring.length) {
                return matchStartIndex;
            } else if (substring[substrPos] !== subject[i]) {
                matchStartIndices.delete(matchStartIndex);
            }
        }

        //if this is a possible match, add it to our set
        if (substring[0] === subject[i]) {
            matchStartIndices.add(i);
        }
    }

    //if it exists at the last possible location, return that index
    if (matchStartIndices.has(subject.length - substring.length)) {
        return subject.length - substring.length;
    }

    //if nothing there, return -1
    return -1;
}
```
With this, all of the edge cases we've identified will be covered.

## Variation: All Substring Positions
Let's take a quick look at a variation of this problem: find *all* indices of a substring within a string. The refinement we made to cover all of the edge cases above can be modified to fit this variation with only a few minor changes:
1. Create a new set to track confirmed start indices.
1. When a possible start index is confirmed, instead of returning that value immediately, add it to the confirmed indices set and remove it from the possible indices set.
1. When the loop has completed, keep the check on the substring in the last possible position. If it is a valid substring, add it to our confirmed set.
1. Return the confirmed set. If no matches found, return an empty set instead of -1.

The full implementation for this can be found in **all-indices-of.mjs**. Our test cases, which cover the edge cases listed above, as well as some "usual" cases, can be found in **test.mjs**.