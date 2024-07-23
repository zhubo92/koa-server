const home = require("../models/home");

const homeService = {
    async getCarouselList() {
        return await home.queryCarouselData();
    }
}

module.exports = homeService;