const crypto = require('crypto');
const { MongoClient,ServerApiVersion } = require("mongodb");
const fs = require('fs');
const logger = require('../logger');


class DataAccessManager {
    constructor() {
      const credentials = process.env.MONGO_DB_CREDENTIALS;
      this.mongoClient = new MongoClient(process.env.MONGO_DB_URL, {
        sslKey: process.env.MONGO_DB_CREDENTIALS,
        sslCert: process.env.MONGO_DB_CREDENTIALS,
        serverApi: ServerApiVersion.v1
      });
      this.dbName = 'smartSMSbot';
      this.collectionName = 'phoneNumbers';
      
    }
  
    async connect() {
      // Connect to the database
      await this.mongoClient.connect();
      this.db = this.mongoClient.db(this.dbName);
      this.collection = this.db.collection(this.collectionName);
      const docCount = await this.collection.countDocuments({});
      logger.info(`Connected to database. Collection ${this.collectionName} has ${docCount} documents.`);
    }

    // Define a function for generating random salts
    generateSalt() {
      // Generate a random string of characters to use as the salt
      return crypto.randomBytes(16).toString('hex');
    }

    // Define a function for hashing a string using a salt
    hashString(str, salt) {

      // Create a hash using the SHA-256 algorithm
      const hash = crypto.createHash('sha256');
      
      // Update the hash with the string and salt
      hash.update(str);
      hash.update(salt);

      // Return the hashed string
      return hash.digest('hex');
    
    }
    async removeData(predicate=null) {
      const result = await this.collection.deleteMany(predicate);
      logger.info(`Removed ${result.deletedCount} documents`);
    }


    async saveOrUpdateBrowserId(phoneNumber, browserId) {
      // logger.info(`Trying to store data for phone number: ${phoneNumber}`);

      // Generate a unique salt for the phone number
      // const salt = this.generateSalt();

      // // Hash the string using the salt
      // const hashedPhoneNumber = this.hashString(phoneNumber, salt);
  
      // Store the hashed phone number and browserid in the database

      // create a filter for a movie to update
      const filter = { phoneNumber : phoneNumber };

      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };

      // create a document that sets the plot of the movie
      const updateDoc = {
        $set: {
          browserId: browserId
        },
      };
      
      try {
        const result = await movies.updateOne(filter, updateDoc, options);
        if (result.matchedCount) {
          logger.info(`Successfully updated data: ${JSON.stringify(result)}`);
        } else {  
          logger.info(`Successfully inserted data: ${JSON.stringify(result)}`);
        }
      } 
      catch (err) {
          logger.customError(err);
      }
    }

    async getBrowserId(phoneNumber) {
      logger.info(`Trying to get browser id for phone number: ${phoneNumber}`);
     
    
      // // Generate a unique salt for the phone number
      // const salt = this.generateSalt();
    
      // // Hash the phoneNumber using the salt
      // const mphoneNumber = this.hashString(phoneNumber, salt);
    
      let result;
      try {

        // Get the browser id for the phone number
        result = await this.collection.findOne({ phoneNumber: phoneNumber });
      } 
      catch (error) {

        logger.customError(error);
        return;
      }
    
      if (!result) {
        logger.info(`No browser id found for phone number: ${phoneNumber}`);
        return;
      }
    
      logger.info(`Retrieved browser id for phone number ${phoneNumber}: ${result.browserId}`);
    
      return result.browserId;
    }    
}
module.exports = DataAccessManager;
  
