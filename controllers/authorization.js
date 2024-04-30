const redisClient = require('./signin').redisClient;

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json('Unathorized')
    }
    console.log("redisClienttt", redisClient)
    await redisClient.connect()
    await redisClient.get(authorization, async (err, reply) => {
        if (err || !reply) {
            return res.status(401).json('Unauthorized');
        }
        
    })

    await redisClient.quit()
    return next()


}


module.exports = {
    requireAuth: requireAuth
}