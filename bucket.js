/**
 * Rate-limiting bucket.
 *
 * @author Jonathan Augustine
 */
class Bucket {
  queue = [];
  interval;

  /**
   *
   * @param {number} maxFlow Maximum runs/interval
   * @param {number} delay Delay between intervals (milliseconds)
   * @param {function} run Action to perform on each enqued value.
   * Takes a single parameter of whatever you put in the Bucket.
   * @param {boolean} debug Whether to log to console
   */
  constructor(maxFlow, delay, run, debug) {
    this.maxFlow = maxFlow;
    this.bucket = maxFlow;
    this.delay = delay;
    this.run = run;
    this.debug = debug;
  }

  /**
   * Add an object to the Queue.
   * @param {*} obj The object to enqueue
   */
  enQ(obj) {
    this.queue.push(obj);
    if (this.queue.length === 1) this.start();
    if (this.debug) console.log("Bucket enQ'ed", obj);
  }

  /** Starts the Bucket runner interval. */
  start() {
    this.interval = setInterval(() => {
      if (this.debug) console.log("running Bucket", this);
      for (; this.bucket > 0 && this.queue.length > 0; this.bucket--) {
        this.run(this.queue.shift());
      }
      this.bucket = this.maxFlow;
      if (this.queue.length === 0) {
        clearInterval(this.interval);
        this.interval = null;
        if (this.debug) console.log("Bucket empty, cleared interval");
      }
    }, this.delay);
  }

  get running() {
    return this.interval !== null;
  }

  get size() {
    return this.queue.length;
  }
}
