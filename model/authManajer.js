const admin = require('./firebase-service')
const database = require('./database')

const getAuthToken = (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        req.authToken = req.headers.authorization.split(' ')[1];
    } else {
        req.authToken = null;
    }
    next();
};

module.exports = checkIfAuthenticated = (req, res, next) => {
    getAuthToken(req, res, async () => {
        try {
            const {authToken} = req;
            req.userInfo = await admin
                .auth()
                .verifyIdToken(authToken);
            let userId = req.userInfo.user_id
            await database.getUser(userId)
                .then(async (databaseFirebaseUserId) => {
                    if (!databaseFirebaseUserId || databaseFirebaseUserId.length === 0) {
                        await database.addUser(userId)
                    }
                })
            return next();
        } catch (e) {
            return res
                .status(401)
                .send({error: 'You are not authorized to make this request'});
        }
    });
};



