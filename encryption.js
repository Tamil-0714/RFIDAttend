// Function to encrypt the student ID
function encryptStudentID(studentID) {
  const shift = 7; // ? Shift ASCII value by 5 for example
  let value = "";

  // ! Shift each character by 'shift' value in the ASCII table
  for (let i = 0; i < studentID.length; i++) {
    let charCode = studentID.charCodeAt(i);
    value += String.fromCharCode(charCode + shift);
  }

  // ! Reverse the string
  // value = [#,1,2,3,4,5,$,6,7,8]
  value = value.split("").reverse();
  const randomStr = `@#$%^&*()-+/><,][{};`; // ~ can add more char

  // ! Encrypt the First 2 char after reversed
  value[7] = String.fromCharCode(value[0].charCodeAt() + 2);
  value[6] = String.fromCharCode(value[0].charCodeAt() + 3);

  // ! inserting a random char at 4th and 0th index
  value.splice(4, 0, randomStr[Math.floor(Math.random() * 20)]);
  value.splice(0, 0, randomStr[Math.floor(Math.random() * 20)]);

  // ! convert array to string
  const encrypted = value.join("");

  return encrypted;
}


// Function to decrypt the student ID
function decryptStudentID(encryptedID) {
  const shift = 7; //  ? The same shift value used in encryption
  let decrypted = "";

  // ! convert string to array
  let decryptedArray = encryptedID.split("");

  // ! removing the random inserted char
  decryptedArray.splice(5, 1);
  decryptedArray.splice(0, 1);

  // ! decrypt the last 2 char before reversed
  decryptedArray[7] = String.fromCharCode(decryptedArray[7].charCodeAt() - 6);
  decryptedArray[6] = String.fromCharCode(decryptedArray[6].charCodeAt() - 7);

  // ! Reverse the string back to original order
  encryptedID = decryptedArray.reverse().join("");

  // ! Unshift each character back by 'shift' value in the ASCII table

  for (let i = 0; i < encryptedID.length; i++) {
    let charCode = encryptedID.charCodeAt(i); // Get ASCII value of character
    decrypted += String.fromCharCode(charCode - shift); // Unshift the ASCII value
  }

  return decrypted;
}

// Example usage
let studentID = "22ucs626";
let encryptedID = encryptStudentID(studentID);
let decryptedID = decryptStudentID(encryptedID);

console.log("Original ID: ", studentID);
console.log("Encrypted ID: ", encryptedID);
console.log("Decrypted ID: ", decryptedID);

// output   
// ~ Original ID:  22ucs626
// ~ Encrypted ID:  &=9=z+j|@?
// ~ Decrypted ID:  22ucs626
