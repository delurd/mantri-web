export const generateRandomLatter = (length?: number) => {
    const alphabet = "ab1cdefghijklmno5346pqr123stuvwxyz2AFG767IJKLMNOPQR07078STUVWXYZ!@#$*_-?qrstuv23wxyzABC51DEFGHI6PQRSN325OPQRSTU34VWXYZ!@#$f7ghijklmcdefg37hi656jklmnopqrstuvwxyz67ABCDEFGHI335JKLYZ!@#$*_-?qrstuvwxyzA12HIJKLM"

    let result = alphabet[Math.floor(Math.random() * alphabet.length)]

    if (length) {
        for (let x = 1; x < length; x++) {
            result += alphabet[Math.floor(Math.random() * alphabet.length)]
        }
    }


    return result
}
