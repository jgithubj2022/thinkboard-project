import { RefreshCw, TimerReset } from "lucide-react";

const RateLimitedUI = ({ onRetry }) => (
  <div className="rounded-3xl border border-warning/30 bg-warning/10 px-6 py-14 text-center">
    <TimerReset className="mx-auto mb-4 size-12 text-warning" />
    <h2 className="text-2xl font-bold">A quick breather</h2>
    <p className="mx-auto mt-2 max-w-lg text-base-content/65">The server received too many requests. Wait a moment, then try loading the board again.</p>
    <button className="btn btn-warning mt-6" onClick={onRetry}><RefreshCw className="size-4" />Try again</button>
  </div>
);

export default RateLimitedUI;
