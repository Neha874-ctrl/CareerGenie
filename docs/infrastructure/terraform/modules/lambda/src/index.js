exports.handler = async (event) => {

    console.log("CareerGenie Lambda triggered");

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Hello from CareerGenie Lambda"
        })
    };
};