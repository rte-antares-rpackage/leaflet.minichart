module.exports = function(numbers) {
  return numbers.map(prettyNumber);
}

function prettyNumber(number) {
  if (isNaN(number) || !isFinite(number)) return "";

  var absVal = Math.abs(number);
  var sign= number < 0? "-": "";

  if( absVal < 1000 ) {
      scale = '';
  } else if( absVal < 1000000 ) {
      scale = 'K';
      absVal = absVal/1000;

  } else if( absVal < 1000000000 ) {
      scale = 'M';
      absVal = absVal/1000000;

  } else if( absVal < 1000000000000 ) {
      scale = 'B';
      absVal = absVal/1000000000;

  } else if( absVal < 1000000000000000 ) {
      scale = 'T';
      absVal = absVal/1000000000000;
  }

  if (absVal > 10) absVal = roundTo(absVal);
  else if (absVal > 1) absVal = roundTo(absVal, 10, true);
  else absVal = roundTo(absVal, 100, true);

  return sign + absVal + scale;
}

function roundTo(number, to, inverse) {
  to = to || 1;
  if (inverse) return Math.round(number * to) / to;
  else return Math.round(number / to) * to;
}
