/**
 * Measure Time is an utility to measure timetaken by the method
 * Utility doesn't use high precision timer
 */
class MeasureTime {
  constructor() {
    this.startTime = new Date();
    this.endTime = null;
    this.totalTime = null;
  }

  start() {
    this.startTime = new Date();
  }

  end() {
    this.endTime = new Date();
  }

  measure() {
    let ret = '';
    if (!this.endTime) this.endTime = new Date();
    const timeTakenMs = new Date(this.endTime - this.startTime);
    const ms = timeTakenMs.getUTCMilliseconds();
    const secs = timeTakenMs.getUTCSeconds();
    const mins = timeTakenMs.getUTCMinutes();
    const hr = timeTakenMs.getUTCHours();

    if (hr > 0) ret += `${hr} hr `;
    if (mins > 0) ret += `${mins} mins `;

    ret += `${secs} secs ${ms} ms`;
    return ret;
  }
}

module.exports = {
  MeasureTime,
};
