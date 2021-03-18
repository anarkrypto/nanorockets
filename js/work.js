function getWorkThreshold(hash, nonce) {
  const input = new ArrayBuffer(8 + 32);
  const input8 = new Uint8Array(input);
  input8.set(hash, 8);
  const bytes64 = new BigUint64Array(input);
  bytes64[0] = BigInt(nonce);
  const out8 = blake2b(input8, null, 8);
  const out64 = new BigUint64Array(out8.buffer);
  return out64[0];
}

const LIVE_DIFFICULTY = BigInt("0xfffffff800000000");
const DIFFICULTY_LIMIT = BigInt(1) << BigInt(64);

function invert(difficulty) {
  if (difficulty === BigInt(0)) {
    return difficulty;
  }
  return DIFFICULTY_LIMIT - difficulty;
}

function thresholdToMultiplier(threshold, base_difficulty) {
  return Number(invert(base_difficulty)) / Number(invert(threshold));
}

function fromHex(s) {
  return new Uint8Array(s.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}


function work_validate(hash, work, base_difficulty = LIVE_DIFFICULTY) {
  const threshold = getWorkThreshold(fromHex(hash), '0x' + work, LIVE_DIFFICULTY);
  const multiplier = thresholdToMultiplier(threshold, base_difficulty);

  //console.log('threshold:  0x' + threshold.toString(16))
  //console.log('multiplier: ' + multiplier)

  return { difficulty: threshold.toString(16), multiplier: multiplier }

}