
  
//   // Initialize the MongoDbHandler class
// //   const mongoDbHandler = new MongoDbHandler();


























// // Define a function for generating random salts
// function generateSalt() {
//   // Generate a random string of characters to use as the salt
//   return crypto.randomBytes(16).toString('hex');
// }

// // Define a function for hashing a string using a salt
// function hashString(str, salt) {
//   // Create a hash using the SHA-256 algorithm
//   const hash = crypto.createHash('sha256');

//   // Update the hash with the string and salt
//   hash.update(str);
//   hash.update(salt);

//   // Return the hashed string
//   return hash.digest('hex');
// }

// // Define a function for storing a hashed string in the database
// async function storeHashedString(str, salt, collection) {
  

//   const data = {
//     phoneNumber: phoneNumber,
//     browserId: browserId,
//   };
  

//   await collection.insertOne({
//     str: hashedString,
//     salt: salt,
//   });
// }



// class MongoDbHandler {
//     // ...
  
//     async storeData(phoneNumber, browserId) {
//       // Generate a unique salt for the phone number
//       const salt = generateSalt();
  
//       // Store the hashed phone number in the database
//       await storeHashedString(phoneNumber, salt, this.collection);
  
//       // Store the browser id in the database
//       const data = {
//         phoneNumber: phoneNumber,
//         browserId: browserId,
//       };
  
//       await this.collection.insertOne(data, (err, result) => {
//         if (err) {
//           logger.customError(err);
//           return;
//         }
//         logger.info(`Successfully stored data: ${JSON.stringify(result)}`);
//       });
//     }
  
//     async getBrowserId(phoneNumber) {

//         // Generate a unique salt for the phone number
//         const salt = generateSalt();

//         // Hash the phoneNumber using the salt
//         const mphoneNumber = hashString(phoneNumber, salt);
      
//         // Get the browser id for the phone number
//         const result = await this.collection.findOne({ phoneNumber: mphoneNumber });

//         logger.info(result);
      
//         if (!!result) {
//           logger.info(`No browser id found for phone number: ${phoneNumber}`);
//           return;
//         }
      
//         logger.info(`Browser id for phone number ${phoneNumber}: ${result.browserId}`);
//     }
// }
          
  































































  



//   // Import the necessary libraries and modules
// const crypto = require('crypto');
// const MongoClient = require('mongodb').MongoClient;

// // Define a function for generating random salts
// function generateSalt() {
//   // Generate a random string of characters to use as the salt
//   return crypto.randomBytes(16).toString('hex');
// }



// // Define a function for storing a hashed string in the database
// async function storeHashedString(str) {
//   // Generate a unique salt for the string
//   const salt = generateSalt();

//   // Hash the string using the salt
//   const hashedString = hashString(str, salt);

//   // Connect to the database
//   const client = await MongoClient.connect(process.env.MONGODB_URI);
//   const db = client.db(process.env.MONGODB_DATABASE);

//   // Store the hashed string and salt in the database
//   await db.collection('hashed_strings').insertOne({
//     str: hashedString,
//     salt: salt,
//   });

//   // Close the connection to the database
//   client.close();
// }

// // Define a function for checking if a string is already stored in the database
// async function isStringStored(str) {
//   // Generate a unique salt for the string
//   const salt = generateSalt();

//   // Hash the string using the salt
//   const hashedString = hashString(str, salt);

//   // Connect to the database
//   const client = await MongoClient.connect(process.env.MONGODB_URI);
//   const db = client.db(process.env.MONGODB_DATABASE);

//   // Check if the hashed string is already stored in the database
//   const result = await db
//     .collection('hashed_strings')
//     .findOne({ str: hashedString });

//   // Close the connection to the database
//   client.close();

//   // Return true if the string is already stored in the database, or false if not
//   return !!result;
// }

// // Example usage:

// // Store a hashed string in the database
// await storeHashedString('my-secret-string');

// // Check if a string is already stored in the database
// const result = await isStringStored('my-secret-string');
// logger.info(result); // Output: true




// //   // Import the necessary libraries and modules
// // const crypto = require('crypto');
// // const MongoClient = require('mongodb').MongoClient;

// // // Define a function for generating random salts
// // function generateSalt() {
// //   // Generate a random string of characters to use as the salt
// //   return crypto.randomBytes(16).toString('hex');
// // }

// // // Define a function for hashing a string using a salt
// // function hashString(str, salt) {
// //   // Create a hash using the SHA-256 algorithm
// //   const hash = crypto.createHash('sha256');

// //   // Update the hash with the string and salt
// //   hash.update(str);
// //   hash.update(salt);

// //   // Return the hashed string
// //   return hash.digest('hex');
// // }

// // // Define a function for storing a hashed string in the database
// // async function storeHashedString(str) {
// //   // Generate a unique salt for the string
// //   const salt = generateSalt();

// //   // Hash the string using the salt
// //   const hashedString = hashString(str, salt);

// //   // Connect to the database
// //   const client = await MongoClient.connect(process.env.MONGODB_URI);
// //   const db = client.db(process.env.MONGODB_DATABASE);

// //   // Store the hashed string and salt in the database
// //   await db.collection('hashed_strings').insertOne({
// //     str: hashedString,
// //     salt: salt,
// //   });

// //   // Close the connection to the database
// //   client.close();
// // }

// // // Define a function for checking if a string is already stored in the database
// // async function isStringStored(str) {
// //   // Generate a unique salt for the string
// //   const salt = generateSalt();

// //   // Hash the string using the salt
// //   const hashedString = hashString(str, salt);

// //   // Connect to the database
// //   const client = await MongoClient.connect(process.env.MONGODB_URI);
// //   const db = client.db(process.env.MONGODB_DATABASE);

// //   // Check if the hashed string is already stored in the database
// //   const result = await db
// //     .collection('hashed_strings')
// //     .findOne({ str: hashedString });

// //   // Close the connection to the database
// //   client.close();

// //   // Return true if the string is already stored in the database, or false if not
// //   return !!result;
// // }

// // // Example usage:

// // // Store a hashed string in the database
// // await storeHashedString('my-secret-string');

// // // Check if a string is already stored in the database
// // const result = await isStringStored('my-secret-string');
// // logger.info(result); // Output: true
































































  

