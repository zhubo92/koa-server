/**
 * 格式化要响应的数据
 * @param status{number} 响应状态码
 * @param data{any} 响应数据
 * @param msg{string} 响应消息
 */
function formatResponse(status, data, msg) {
    return {
        status,
        data,
        msg
    }
}

/**
 * 请求成功
 */
function successResponse(data = null, msg = '成功') {
    return formatResponse(200, data, msg);
}

/**
 * 处理业务请求错误的基类
 */
class ServiceError extends Error {
    /**
     * @param message{string} 错误消息
     * @param status{number} 错误状态码
     */
    constructor(message, status) {
        super(message);
        this.status = status;
        return formatResponse(this.status, null, this.message);
    }
}

/**
 * 未知错误
 */
class UnknownError extends ServiceError {
    constructor(message = "服务器错误") {
        super(message, 500);
    }
}

/**
 * 文件上传错误
 */
class UploadError extends ServiceError {
    constructor(message = "文件上传错误") {
        super(message, 413);
    }
}

/**
 * 禁止访问错误
 */
class ForbiddenError extends ServiceError {
    constructor(message = "token 已过期，请重新登录") {
        super(message, 401);
    }
}

/**
 * 验证错误
 */
class ValidationError extends ServiceError {
    constructor(message = "验证错误") {
        super(message, 406);
    }
}

/**
 * 无资源错误
 */
class NotFoundError extends ServiceError {
    constructor(message = "无资源错误") {
        super(message, 404);
    }
}

/**
 * 格式化分页数据
 */
function formatPageResponse(list, total, page, pageSize) {
    return {
        list,
        total,
        page,
        pageSize
    }
}

module.exports = {
    successResponse,
    UnknownError,
    UploadError,
    ForbiddenError,
    ValidationError,
    NotFoundError,
    formatPageResponse,
}