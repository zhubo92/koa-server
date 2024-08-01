function isProd() {
    console.log(process.env.NODE_ENV,'process.env.NODE_ENV');
    return process.env.NODE_ENV === 'production';
}

module.exports = {
    isProd
}