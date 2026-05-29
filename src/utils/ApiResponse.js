class ApiResponse {
    constructor(statusCode, data) {
        this.success = true,
        this.statusCode = statusCode;
        this.data = data
    }
}

module.exports = ApiResponse;