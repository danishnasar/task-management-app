const errorHandler = (err, req, res, next) => {
    const error = { ...err };
    let statusCode = 400;
    error.message = err.message;

    //Incorrect ID format
    if (err.name === 'CastError') {
        error.message = `Resource not found`;
        statusCode = 404;
    }
    //Login Error
    if (err.name === 'LoginError') {
        statusCode = err.code;
    }
    //Duplicate field value
    if (err.code === 11000) {
        error.message = `Duplicate field value entered`;
    }
    //Validation error
    if (err.name === 'ValidationError') {
        error.message = Object.values(err.errors).map((item) => item.message).toString();
    }

    if (err.name === 'TypeError') {
        error.message = 'Incorrect Id';
    }

    res.status(statusCode).json({
        success: false,
        msg: error.message
    })
};

module.exports = errorHandler;