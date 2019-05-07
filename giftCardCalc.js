import fs from 'fs';
import readLines from './readLines';
import { formatTestResults } from '@jest/test-result';
let [,, dataPath, inputSum] = process.argv;
let products = [];
let product;
let hashTable = {};
let startTime = process.hrtime();
inputSum = Number(inputSum);

const readText = async () => {
    var input = fs.createReadStream( dataPath );
    await readLines(input, addToProducts);
    return;
}

const addToProducts = (data) => {
    product = data.split(',');
    products.push(product);
    hashTable[Number(product[1])] = product[0];
    // reading file timing
    // let endTime = process.hrtime(startTime);
    // console.log(`execution time: ', ${endTime[0]} sec, ${endTime[1]/1000000} nnsec` );
  }

const traverse = () => {
    // decend order
    products.reverse();
    let minimalDiff = {[inputSum]: "no match, gift card doesn't fit two products" };
    for ( let ind = 0; ind < products.length; ind++ ){
        console.log(products[ind][1]);
        let currenDiff = Number(inputSum) - products[ind][1];
        console.log('current diff', currenDiff);
        if (currenDiff >= 0 && hashTable[currenDiff] != null ) {
            console.log('found pair:', hashTable[currenDiff], product[1] );
            return [ hashTable[currenDiff], products[ind][0] ];
        } else {
            if ( Number( Object.keys(minimalDiff)[0] ) > currenDiff) {
                // check from cheapest what is the largest number that fits the current diff
                let min  = checkMinimal(currenDiff, ind);
                // not null or undefined
                if (min != null ) {
                 minimalDiff = { [currenDiff] : products[ind][1].toString() + min[1].toString()}
                }
            } 
            hashTable[Number(product[1])] = product[0];
            console.log('product[1]', products[ind][1] );
        }
    }
    return minimalDiff;
}; 

const checkMinimal = (currenDiff, index ) => {
    let minimal;
    for (let i = products.length-1 ; i > products.length - index; i--) {
        if (products[i][1] < currenDiff ) {
            minimal = products[i];
        } else {
            return minimal;
        }
    }
}
readText()
  .then(() => {return traverse()} )
  .then(result => console.log(result) );
