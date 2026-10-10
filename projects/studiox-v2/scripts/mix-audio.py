"""Build a deterministic 30-second music/SFX mix; numpy and ffmpeg required."""
from pathlib import Path
import json
import subprocess
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SR = 48000
N = SR * 30
rng = np.random.default_rng(217)
source = ROOT / "assets/catalyst-source.mp3"
decoded = subprocess.run([
    "ffmpeg", "-v", "error", "-ss", "80", "-i", str(source), "-t", "30",
    "-f", "f32le", "-ac", "2", "-ar", str(SR), "pipe:1"
], check=True, capture_output=True).stdout
music = np.frombuffer(decoded, dtype="<f4").reshape(-1, 2).astype(float)
if len(music) != N:
    raise RuntimeError("Music excerpt must contain exactly 30 seconds")
t = np.arange(N) / SR
envelope = np.interp(t, [0, .12, 2.7, 4, 17, 21, 25, 27.5, 29.8, 30],
                     [0, .24, .55, .85, 1, 1, .8, .6, .02, 0])
mix = music * envelope[:, None]
events = []

def add(at, signal, gain, pan, kind):
    pos = round(at * SR)
    size = min(len(signal), N - pos)
    gains = np.array([np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)])
    mix[pos:pos + size] += signal[:size, None] * gains * gain
    events.append({"time": at, "kind": kind, "gain": gain, "pan": pan})

def hit(at, power=1, pan=0):
    q = np.arange(round(SR * 1.1)) / SR
    phase = 2 * np.pi * (43 * q + 37 * .1 * (1 - np.exp(-q / .1)))
    bass = np.sin(phase) * np.exp(-q * 7)
    n = rng.normal(0, 1, len(q))
    snap = (n - np.roll(n, 1)) * np.exp(-q * 55) * .065
    add(at, bass + snap, .22 * power, pan, "low impact / transient")

def swish(at, duration=.5, pan=0):
    q = np.arange(round(SR * duration)) / SR
    n = rng.normal(0, 1, len(q))
    smooth = np.convolve(n, np.ones(7) / 7, mode="same")
    band = n * .07 + smooth * .3
    env = np.sin(np.pi * q / duration) ** 3
    tonal = np.sin(2 * np.pi * (280 * q + 1600 * q * q)) * .07
    add(at, (band + tonal) * env, .25, pan, "directional swish")

def tick(at, pan=0, pitch=1700):
    q = np.arange(round(SR * .09)) / SR
    signal = (np.sin(2 * np.pi * pitch * q) + rng.normal(0, .2, len(q))) * np.exp(-q * 90)
    add(at, signal, .10, pan, "interface click")

def shimmer(at, pan=0):
    q = np.arange(round(SR * 1.6)) / SR
    signal = sum(np.sin(2 * np.pi * f * q) * np.exp(-q * (3 + i))
                 for i, f in enumerate([880, 1320, 1760])) / 3
    add(at, signal, .055, pan, "glass detail")

hit(.06, .7); shimmer(.28, -.3)
for at, pan in [(.7, -.65), (1.05, .45), (6.3, .4), (9.3, -.4), (10.2, .4), (12.55, 0), (14.1, .4)]:
    tick(at, pan)
for at, duration, pan in [(3.6, .4, -.4), (7.55, .45, .45), (12.05, .45, -.45),
                           (16.4, .6, .4), (20.4, .6, -.2), (24.45, .55, .1)]:
    swish(at, duration, pan)
for at, power, pan in [(4, .85, 0), (8, .9, -.1), (17, 1.05, 0),
                        (18.33, .65, -.3), (19.67, .85, .3), (21, 1.15, 0), (25, .65, 0)]:
    hit(at, power, pan)
shimmer(23.1, .3); shimmer(25.2, -.2)
# Micro-gaps before the montage edits make the impacts distinct.
for at in [17, 18.33, 19.67, 21]:
    lo, hi = round((at - .07) * SR), round(at * SR)
    mix[lo:hi] *= np.linspace(1, .36, hi - lo)[:, None]
mix *= np.minimum(1, (30 - t) / .25)[:, None]
raw = ROOT / "assets/mix-premaster.wav"
with wave.open(str(raw), "wb") as out:
    out.setparams((2, 2, SR, N, "NONE", "not compressed"))
    out.writeframes((np.clip(mix, -.999, .999) * 32767).astype("<i2").tobytes())
analysis = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(raw), "-af",
    "loudnorm=I=-14:TP=-1.5:LRA=8:print_format=json", "-f", "null", "-"],
    check=True, capture_output=True, text=True).stderr
stats = json.loads(analysis[analysis.rfind("{"):])
filter_expr = ("loudnorm=I=-14:TP=-1.5:LRA=8:linear=true:" +
    ":".join(f"{key}={stats[value]}" for key, value in {
        "measured_I":"input_i", "measured_TP":"input_tp", "measured_LRA":"input_lra",
        "measured_thresh":"input_thresh", "offset":"target_offset"}.items()))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(raw), "-af", filter_expr,
    "-ar", str(SR), "-c:a", "pcm_s16le", str(ROOT / "assets/soundtrack.wav")], check=True)
raw.unlink()
(ROOT / "audio-cues.json").write_text(json.dumps({
    "music": {"track": "Catalyst", "composer": "Scott Buckley", "sourceIn": 80,
              "duration": 30, "license": "CC BY 4.0", "changes": "excerpt, fades and original SFX"},
    "target": {"integratedLUFS": -14, "truePeakDbTP": -1.5}, "events": events,
    "premasterAnalysis": stats}, indent=2) + "\n")
print("Built 30-second stereo soundtrack with", len(events), "sound cues")
