module.exports = {
    require: jest.genMockFunction(),
    match: jest.genMockFunction(),
    app: {
      getPath: jest
      .genMockFunction()
    },
    remote: jest.genMockFunction(),
    dialog: jest.genMockFunction(),
  };

