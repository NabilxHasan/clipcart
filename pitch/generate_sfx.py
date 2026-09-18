import os
import wave
import struct
import math

SAMPLE_RATE = 44100

def write_wav(filename, samples):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)  # Mono
        wav_file.setsampwidth(2)  # 16-bit
        wav_file.setframerate(SAMPLE_RATE)
        packed_samples = []
        for s in samples:
            val = max(-1.0, min(1.0, s))
            int_val = int(val * 32767.0)
            packed_samples.append(struct.pack('<h', int_val))
        wav_file.writeframes(b''.join(packed_samples))
    print(f"Generated {filename} ({len(samples)} samples, {len(samples)/SAMPLE_RATE:.2f}s)")

# 1. Sub Bass Cinematic Impact
def make_impact(duration=1.4):
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        freq = 35.0 + 75.0 * math.exp(-t * 6.0)
        phase = 2.0 * math.pi * (35.0 * t - (75.0 / 6.0) * math.exp(-t * 6.0))
        punch = math.sin(2.0 * math.pi * 320.0 * t) * math.exp(-t * 40.0) * 0.4 if t < 0.1 else 0
        body = math.sin(phase) * math.exp(-t * 2.8) * 0.85
        raw = body + punch
        samples.append(math.tanh(raw))
    return samples

# 2. Transition Whoosh
def make_whoosh(duration=0.8):
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    seed = 42
    def rand():
        nonlocal seed
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        return (seed / 0x7fffffff) * 2.0 - 1.0

    last_val = 0.0
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        if t < 0.5 * duration:
            env = math.sin((t / (0.5 * duration)) * (math.pi / 2)) ** 2
        else:
            env = math.cos(((t - 0.5 * duration) / (0.5 * duration)) * (math.pi / 2)) ** 2
        cutoff_freq = 300.0 + 3200.0 * env
        alpha = min(0.95, (2.0 * math.pi * cutoff_freq / SAMPLE_RATE))
        noise = rand()
        last_val = last_val + alpha * (noise - last_val)
        samples.append(last_val * env * 0.75)
    return samples

# 3. Soft UI Swipe Whoosh
def make_whoosh_soft(duration=0.45):
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    seed = 137
    def rand():
        nonlocal seed
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        return (seed / 0x7fffffff) * 2.0 - 1.0

    last_val = 0.0
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        progress = t / duration
        env = math.sin(progress * math.pi) ** 2
        cutoff_freq = 400.0 + 2000.0 * env
        alpha = min(0.85, (2.0 * math.pi * cutoff_freq / SAMPLE_RATE))
        noise = rand()
        last_val = last_val + alpha * (noise - last_val)
        samples.append(last_val * env * 0.45)
    return samples

# 4. Cinematic Riser
def make_riser(duration=2.5):
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    phase = 0.0
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        progress = t / duration
        freq = 90.0 * math.pow(650.0 / 90.0, progress)
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        env = (progress ** 2.2) * 0.8
        pulse = 1.0 + 0.15 * math.sin(2.0 * math.pi * (8.0 + 16.0 * progress) * t)
        val = (math.sin(phase) * 0.7 + math.sin(phase * 2) * 0.2 + math.sin(phase * 3) * 0.1) * env * pulse
        samples.append(val)
    return samples

# 5. Tactile UI Click / Snap
def make_click(duration=0.06):
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        decay = math.exp(-t * 120.0)
        val = (math.sin(2.0 * math.pi * 2400.0 * t) * 0.6 + math.sin(2.0 * math.pi * 1200.0 * t) * 0.4) * decay
        samples.append(val * 0.8)
    return samples

# 6. Sparkling Confirmation Chime (bKash / Success Bell)
def make_chime(duration=1.8):
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    f1, f2, f3 = 1046.5, 1318.5, 1567.98
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        decay = math.exp(-t * 3.5)
        harm1 = math.sin(2.0 * math.pi * f1 * t) * decay * 0.45
        harm2 = math.sin(2.0 * math.pi * f2 * t) * math.exp(-t * 4.0) * 0.35
        harm3 = math.sin(2.0 * math.pi * f3 * t) * math.exp(-t * 4.5) * 0.25
        shimmer = math.sin(2.0 * math.pi * (f3 * 2.0) * t) * math.exp(-t * 6.0) * 0.15
        samples.append(harm1 + harm2 + harm3 + shimmer)
    return samples

# 7. Laser AI Scan Chirp
def make_scan(duration=1.0):
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    phase = 0.0
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        freq = 1400.0 + 800.0 * math.sin(2.0 * math.pi * 12.0 * t) + 600.0 * (t / duration)
        phase += 2.0 * math.pi * freq / SAMPLE_RATE
        env = math.sin((t / duration) * math.pi) ** 1.5
        val = math.sin(phase) * env * 0.4
        samples.append(val)
    return samples

# 8. Pop Sound (Badge entrance)
def make_pop(duration=0.12):
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        decay = math.exp(-t * 45.0)
        freq = 700.0 * math.exp(-t * 30.0) + 150.0
        val = math.sin(2.0 * math.pi * freq * t) * decay * 0.65
        samples.append(val)
    return samples

# 9. Grand Finale Impact
def make_finale(duration=2.2):
    num_samples = int(duration * SAMPLE_RATE)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        freq = 40.0 + 80.0 * math.exp(-t * 4.0)
        phase = 2.0 * math.pi * (40.0 * t - (80.0 / 4.0) * math.exp(-t * 4.0))
        punch = math.sin(2.0 * math.pi * 280.0 * t) * math.exp(-t * 30.0) * 0.5 if t < 0.15 else 0
        body = math.sin(phase) * math.exp(-t * 1.8) * 0.8
        sub = math.sin(2.0 * math.pi * 28.0 * t) * math.exp(-t * 1.4) * 0.4
        raw = body + punch + sub
        samples.append(math.tanh(raw))
    return samples

def main():
    target_dir = os.path.join(os.path.dirname(__file__), "assets", "sfx")
    write_wav(os.path.join(target_dir, "sfx_impact.wav"), make_impact())
    write_wav(os.path.join(target_dir, "sfx_whoosh.wav"), make_whoosh())
    write_wav(os.path.join(target_dir, "sfx_whoosh_soft.wav"), make_whoosh_soft())
    write_wav(os.path.join(target_dir, "sfx_riser.wav"), make_riser())
    write_wav(os.path.join(target_dir, "sfx_click.wav"), make_click())
    write_wav(os.path.join(target_dir, "sfx_chime.wav"), make_chime())
    write_wav(os.path.join(target_dir, "sfx_scan.wav"), make_scan())
    write_wav(os.path.join(target_dir, "sfx_pop.wav"), make_pop())
    write_wav(os.path.join(target_dir, "sfx_finale.wav"), make_finale())
    print("All motion sound effects successfully synthesized!")

if __name__ == "__main__":
    main()
