module.exports = {
  require: jest.genMockFunction(),
  match: jest.genMockFunction(),
  app: {
    getPath: jest
    .genMockFunction()
  },
  remote: jest.genMockFunction(),
  dialog: jest.genMockFunction(),
  ipcMain: {
      // on: jest.genMockFunction()
      on: function(message) {
          if (message.includes('set-location-for-notebooks')) {
              console.log('Process books');
          } else {
              console.log('Process other');
          }
      }
  }
};

