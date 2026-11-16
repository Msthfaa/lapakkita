import imageio_ffmpeg
import subprocess
import os

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

delays = [3500, 10000, 17500, 24000, 32500, 42000, 51000, 56500]
inputs = []
filter_parts = []

for i in range(8):
    fn = f'temp_audio/gadis_new_{i}.mp3'
    if not os.path.exists(fn):
        raise FileNotFoundError(f"Missing {fn}")
    inputs.extend(['-i', fn])
    d = delays[i]
    filter_parts.append(f'[{i}:a]adelay={d}|{d},volume=1.3[a{i}]')

# Create warm soft ambient chord drone (220Hz + 330Hz + 440Hz + 550Hz) filtered and faded
bg_synth = "sine=frequency=220:duration=68[s1];sine=frequency=330:duration=68[s2];sine=frequency=440:duration=68[s3];[s1][s2][s3]amix=inputs=3,volume=0.03,lowpass=f=600,afade=t=in:st=0:d=2.5,afade=t=out:st=65.5:d=2.5[bgm]"

mix_inputs = ''.join(f'[a{i}]' for i in range(8))
filter_str = f"{bg_synth};{';'.join(filter_parts)};{mix_inputs}[bgm]amix=inputs=9:duration=longest:dropout_transition=2,apad=whole_dur=68.0[outa]"

out_path = os.path.join("public", "demo_audio_track.mp3")

cmd = [
    ffmpeg, "-y",
    *inputs,
    "-filter_complex", filter_str,
    "-map", "[outa]",
    "-t", "68.0",
    "-c:a", "libmp3lame",
    "-b:a", "192k",
    out_path
]

res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
if res.returncode != 0:
    print("Error mixing audio:", res.stderr)
    raise RuntimeError(res.stderr)
else:
    print(f"Successfully generated {out_path} (68.0s)")
