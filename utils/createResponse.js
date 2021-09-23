const createResponse = (status, reference, aggregateName, aggregateData) => {
    const response = {
        status,
        reference
    }
    
    if (aggregateName && aggregateData) response[aggregateName] = aggregateData;
    
    return response;
}

module.exports = createResponse;