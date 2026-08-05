import {Ratelimit} from "@upstash/ratelimit"
import {Redis} from "@upstash/redis"

import dotenv from "dotenv"//allows us to use .env

dotenv.config();
// i want a rate limiter allowing 20 requests per 60 seconds
const ratelimit = new Ratelimit( {
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(20,"60 s")
})

export default ratelimit