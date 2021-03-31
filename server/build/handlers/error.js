"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
var errorHandler = function (err, req, res, next) {
    return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || "something went wrong on the server!"
    });
};
exports.errorHandler = errorHandler;
