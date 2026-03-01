const button = document.getElementById("actionBtn");
const secretSection = document.getElementById("secretSection");

button.addEventListener("click", () => {
  secretSection.style.display = "block";
  secretSection.scrollIntoView({ behavior: "smooth" });
});
const video = document.getElementById("secretVideo");

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const source = audioContext.createMediaElementSource(video);

const gainNode = audioContext.createGain();
gainNode.gain.value = 1; // aumenta o ganho (1 = normal)

const distortion = audioContext.createWaveShaper();

function makeDistortionCurve(amount) {
  const k = typeof amount === "number" ? amount : 50;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;

  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
  }
  return curve;
}

distortion.curve = makeDistortionCurve(400);
distortion.oversample = "2x";

source.connect(gainNode);
gainNode.connect(distortion);
distortion.connect(audioContext.destination);

button.addEventListener("click", () => {
  audioContext.resume();
  video.play();
});
