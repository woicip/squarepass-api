function generateID(){
    const length = 16;
    let ID = '';
    
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    const number = [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '0' ];

    const alphabetCalculate = alphabet.length > 25 ? alphabet.length - 1 : alphabet.length;
    const numberCalculate = number.length > 9 ? number.length - 1 : number.length;
    
    for(let i = 0; i < length / 2; i++){
        let indexAlphabet = Math.round(Math.random() * alphabetCalculate); //console.log(indexAlphabet);
        let indexNumber = Math.round(Math.random() * numberCalculate); //console.log(indexNumber);
    
        ID += alphabet[indexAlphabet];
        ID += number[indexNumber];
    }

    return ID;
}

module.exports = generateID;