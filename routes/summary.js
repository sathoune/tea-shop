const   express         = require("express"),
        dbFunctions     = require("../functions/dbFunctions"),
        uiDisplay       = require("../functions/uiDisplay"),
        router          = express.Router({ mergeParams: true });


module.exports = router;