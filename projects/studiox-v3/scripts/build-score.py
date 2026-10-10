"""Thirty-second scored edit with sectional music cuts and event-driven sound design."""
from pathlib import Path
import json
import subprocess
import wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SR, SECONDS = 48000, 30
N = SR * SECONDS
t = np.arange(N, dtype=np.float64) / SR
rng = np.random.default_rng(3041)
mix = np.zeros((N, 2), dtype=np.float64)
events = []

def decode(at, length):
    raw = subprocess.run([
        'ffmpeg', '-v', 'error', '-ss', str(at), '-i', str(ROOT/'assets/catalyst-source.mp3'),
        '-t', str(length), '-f', 'f32le', '-ac', '2', '-ar', str(SR), 'pipe:1'
    ], check=True, capture_output=True).stdout
    samples = np.frombuffer(raw, dtype='<f4').reshape(-1, 2).astype(np.float64)
    if len(samples) < int(length*SR)-SR//20:
        raise RuntimeError('Music source shorter than required section')
    return samples

def section(dst, src, duration, gain):
    samples = decode(src, duration)
    start = round(dst*SR)
    n = min(len(samples), N-start)
    q = np.arange(n)/SR
    rise = np.clip(q/.14, 0, 1)
    fall = np.clip((duration-q)/.27, 0, 1)
    mix[start:start+n] += samples[:n]*np.minimum(rise,fall)[:,None]*gain
    events.append({'time':dst,'kind':'music section','sourceIn':src,'duration':duration})

# Three different phrases of one licensed composition. Breaks land with the film's world changes.
section(0, 76, 9.94, .33)
section(10, 121, 9.95, .46)
section(20, 168, 7.18, .53)
section(27.10, 198, 2.9, .29)

def add(at, sound, gain=1, pan=0, kind='effect'):
    start = round(at*SR)
    n = max(0, min(len(sound), N-start))
    if n == 0: return
    p = np.array([np.cos((pan+1)*np.pi/4), np.sin((pan+1)*np.pi/4)])
    mix[start:start+n] += sound[:n,None]*p*gain
    events.append({'time':round(at,3),'kind':kind,'gain':gain,'pan':pan})

def impact(at, strength=1, pan=0, hz=52):
    q=np.arange(round(.75*SR))/SR
    low=np.sin(2*np.pi*(hz*q+24*(1-np.exp(-q*30))/30))*np.exp(-q*9)
    bite=rng.normal(0,1,len(q))*np.exp(-q*49)*.09
    add(at,low*.24+bite,strength,pan,'sub impact')

def cut(at, direction=1, duration=.34, gain=.15):
    q=np.arange(round(duration*SR))/SR
    noise=rng.normal(0,1,len(q))
    noise=np.convolve(noise,np.ones(7)/7,'same')
    env=np.sin(np.pi*q/duration)**2
    chirp=np.sin(2*np.pi*(260*q+950*q*q/duration))*.15
    add(at,(noise*.45+chirp)*env,gain,direction*.6,'directional cut')

def tick(at, pan=0, pitch=1450, gain=.035):
    q=np.arange(round(.12*SR))/SR
    sig=(np.sin(2*np.pi*pitch*q)+rng.normal(0,.15,len(q)))*np.exp(-q*70)
    add(at,sig,gain,pan,'interface transient')

def rise(at, duration, pan=0, gain=.045):
    q=np.arange(round(duration*SR))/SR
    noise=rng.normal(0,1,len(q))
    # Filter slowly changing grit, and increase pitch at the visible camera drive.
    filtered=noise-np.convolve(noise,np.ones(33)/33,'same')
    tone=np.sin(2*np.pi*(150*q+360*q*q/duration))
    envelope=(q/duration)**2.4*np.minimum(1,(duration-q)/.08)
    add(at,(filtered*.09+tone*.14)*envelope,gain,pan,'camera rise')

# A restrained, regular pulse supports each moving action. It stops for both act handoffs.
for beat in np.arange(0,26.75,.5):
    if 9.5 < beat < 10.5 or 19.5 < beat < 20.5: continue
    if beat >= 27: break
    q=np.arange(round(.34*SR))/SR
    soft=np.sin(2*np.pi*(56*q+21*(1-np.exp(-q*18))/18))*np.exp(-q*19)
    add(float(beat),soft,.075 if beat%2 else .115,0,'rhythm pulse')
    if int(beat*2)%2:
        tick(float(beat)+.25,pan=(-1 if int(beat*2)%4 else 1),pitch=3800,gain=.010)

for at, strength in [(0.42,.65),(1.04,.75),(2.35,.8),(3.85,.62),(7.76,.65),
                     (10.0,1.25),(12.85,.58),(14.50,.63),(16.57,.95),(18.66,.72),
                     (20.0,1.35),(21.08,1.0),(22.95,.9),(23.68,.72),
                     (25.04,1.45),(26.93,1.05),(27.40,.54)]:
    impact(at,strength,pan=(-.23 if int(at)%2 else .22))
for at, pan in [(2.15,-1),(3.62,1),(4.18,-1),(5.03,1),(7.54,1),
                (9.16,1),(12.60,-1),(14.27,1),(16.34,-1),(18.43,1),
                (19.23,1),(20.82,-1),(22.72,1),(24.47,-1),(26.70,1)]:
    cut(at,pan)
for at, pan in [(4.28,-.4),(5.13,.4),(6.82,.6),(10.42,-.5),(12.86,.5),(14.51,-.5)]:
    tick(at,pan,1300,.048)
for at,dur in [(8.12,1.82),(18.30,1.62),(24.15,.86)]: rise(at,dur)

# Short gaps before the light wipes reveal impacts instead of masking them.
for at in [10,20]:
    lo,hi=round((at-.11)*SR),round((at-.015)*SR)
    mix[lo:hi]*=np.linspace(1,.14,hi-lo)[:,None]
mix*=np.minimum(1,(30-t)/.35)[:,None]
peak=np.max(np.abs(mix))
if peak > .93: mix*=.93/peak

premaster=ROOT/'assets/score-premaster.wav'
with wave.open(str(premaster),'wb') as out:
    out.setparams((2,2,SR,N,'NONE','not compressed'))
    out.writeframes((np.clip(mix,-.999,.999)*32767).astype('<i2').tobytes())

# The technical loudness target cannot replace an actual listening review.
first=subprocess.run(['ffmpeg','-hide_banner','-i',str(premaster),'-af',
                      'loudnorm=I=-14:TP=-1.5:LRA=9:print_format=json','-f','null','-'],
                     capture_output=True,text=True,check=True).stderr
stats=json.loads(first[first.rfind('{'):])
mapping={'measured_I':'input_i','measured_TP':'input_tp','measured_LRA':'input_lra',
         'measured_thresh':'input_thresh','offset':'target_offset'}
expression='loudnorm=I=-14:TP=-1.5:LRA=9:linear=true:'+':'.join(f'{k}={stats[v]}' for k,v in mapping.items())+',apad=whole_dur=30,atrim=duration=30'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(premaster),'-af',expression,
                '-ar',str(SR),'-c:a','pcm_s16le',str(ROOT/'assets/score.wav')],check=True)
premaster.unlink()
(ROOT/'audio-cues.json').write_text(json.dumps({'music':'Catalyst by Scott Buckley · CC BY 4.0',
    'sectionSourceSeconds':[76,121,168,198],'events':events,'loudness':stats},indent=2)+'\n')
print(f'30-second stereo score: {len(events)} timed music and sound events, peak before master {peak:.3f}')
