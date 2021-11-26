/**
 * Find all occurences of a substring within a string
 * @param subject : the string to test the substring upon
 * @param substring 
 */
export function stringIndicesOf(subject, substring) {
    const foundIndices = [];

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
                foundIndices.push(matchStartIndex);
                matchStartIndices.delete(matchStartIndex);
            } else if (substring[substrPos] !== subject[i]) {
                matchStartIndices.delete(matchStartIndex);
            }
        }

        //if this is a possible match, 
        if (substring[0] === subject[i]) {
            matchStartIndices.add(i);
        }
    }

    //if it exists at the last possible location, record that index
    if (matchStartIndices.has(subject.length - substring.length)) {
        foundIndices.push(subject.length - substring.length);
    }

    return foundIndices;
}