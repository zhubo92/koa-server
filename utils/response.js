/**
 * 请求状态码
 * 200 （成功）服务器已成功处理了请求。
 * 401（未授权）请求要求身份验证。一旦出现这个状态，需要重新登陆
 * 403 （无权限）请求的资源不允许访问。比如说，你使用普通用户的 Token 去请求管理员才能访问的资源。
 * 404（未找到）服务器找不到请求的网页。
 * 408（请求超时）服务器等候请求时发生超时 。
 * 500（服务器内部错误）服务器遇到错误，无法完成请求。
 */


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
    constructor(message = "身份验证失败，请重新登录") {
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