import ratelimit from "../config/upstash.js"

const rateLimiter = async(req,res,next) => {
    try {
        //const {success} = await ratelimit.limit("my-limit-key");//usually authentiicated with user id but 
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "127.0.0.1";//limit amount of requests users can make by ip since no user system

        // pass the IP address as a string to Upstash
        const { success, limit, remaining, reset } = await ratelimit.limit(ip);

        // Set standard rate limit headers on the response
        res.setHeader("X-RateLimit-Limit", limit);
        res.setHeader("X-RateLimit-Remaining", remaining);
        res.setHeader("X-RateLimit-Reset", reset);
        if(!success) {
            return res.status(429).json({message: "Too many requests, please try again later."})
        }

        next();
    }catch (error) {
        console.log("Rate Limiit Error")
        next(error);
    }
}

export default rateLimiter