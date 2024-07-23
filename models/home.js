const {dbQuery} = require("../db");

const home = {
    async queryCarouselData () {
        return await dbQuery(`select * from pdd_homecasual`);
    }
}

module.exports = home;