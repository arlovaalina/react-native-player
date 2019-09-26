const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  const secondsString = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${secondsString}`;
};

export default formatTime;
