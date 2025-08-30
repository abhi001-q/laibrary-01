// Mock database connection for testing purposes
const mockConnectDB = async () => {
  return new Promise((resolve) => {
    console.log('Using mock database connection for development');
    setTimeout(resolve, 1000);
  });
};

export default mockConnectDB;
