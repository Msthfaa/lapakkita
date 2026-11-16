import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg
import subprocess

FPS = 30
WIDTH = 1920
HEIGHT = 1080
DURATION = 68.0
TOTAL_FRAMES = int(DURATION * FPS)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, "public", "demo-screenshots")
PUBLIC_DIR = os.path.join(BASE_DIR, "public")
AUDIO_DIR = os.path.join(BASE_DIR, "temp_audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

# Load screenshots and logo
img_logo = Image.open(os.path.join(PUBLIC_DIR, "logo-dark.png")).convert("RGBA")
img_home = Image.open(os.path.join(SCREENSHOTS_DIR, "homepage.png")).convert("RGBA")
img_katalog = Image.open(os.path.join(SCREENSHOTS_DIR, "katalog.png")).convert("RGBA")
img_detail = Image.open(os.path.join(SCREENSHOTS_DIR, "product-detail.png")).convert("RGBA")
img_wa_desktop = Image.open(os.path.join(SCREENSHOTS_DIR, "product-whatsapp.png")).convert("RGBA")
img_mobile_wa = Image.open(os.path.join(SCREENSHOTS_DIR, "mobile-whatsapp.png")).convert("RGBA")
img_tentang = Image.open(os.path.join(SCREENSHOTS_DIR, "tentang.png")).convert("RGBA")

# System fonts
FONT_TITLE = "C:\\Windows\\Fonts\\arialbd.ttf"
FONT_REGULAR = "C:\\Windows\\Fonts\\arial.ttf"
FONT_ITALIC = "C:\\Windows\\Fonts\\arialbi.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

f_badge = get_font(FONT_TITLE, 22)
f_h1 = get_font(FONT_TITLE, 50)
f_sub = get_font(FONT_REGULAR, 26)
f_sub_small = get_font(FONT_TITLE, 18)
f_sub_bold = get_font(FONT_TITLE, 28)
f_brand = get_font(FONT_TITLE, 34)
f_url = get_font(FONT_TITLE, 38)
f_cta = get_font(FONT_TITLE, 32)
f_tagline = get_font(FONT_REGULAR, 26)
f_counter = get_font(FONT_TITLE, 64)

# Subtitles matching Indonesian VO 100% word-for-word
SUBTITLES = [
    (3.5, 9.5, "Punya produk UMKM jempolan, tapi bingung cara pasarinnya ke pelanggan yang tepat?"),
    (10.0, 17.0, "Jualan di status medsos cepat tenggelam, pembeli ragu, dan biaya platform bikin boncos!"),
    (17.5, 23.5, "Kini hadir LapakKita — rumah digital produk UMKM lokal terpercaya."),
    (24.0, 31.5, "Fitur pertama: Kurasi dan Verifikasi Admin. Menjamin setiap produk asli dan bebas penipuan."),
    (32.5, 41.0, "Fitur kedua: Direct WhatsApp Order. Satu klik langsung chat penjual, tanpa biaya perantara!"),
    (42.0, 50.2, "Fitur ketiga: Dashboard Mandiri. Upload foto produk dan pantau minat pembeli secara real-time."),
    (51.0, 56.2, "Saatnya produk lokalmu naik kelas dan dipercaya lebih banyak pelanggan!"),
    (56.5, 63.2, "Kunjungi www.lapakkita.my.id — Daftarkan usahamu gratis hari ini!"),
]

ffmpeg_bin = imageio_ffmpeg.get_ffmpeg_exe()
combined_audio = os.path.join(PUBLIC_DIR, "demo_audio_track.mp3")

if not os.path.exists(combined_audio):
    print("Generating audio track via mix_audio.py...")
    import mix_audio

# Mockup helpers
def create_laptop_mockup(screen_img, target_width=980):
    screen_ratio = 16 / 9
    screen_w = target_width
    screen_h = int(screen_w / screen_ratio)
    
    pad = 16
    cam_h = 24
    bezel_w = screen_w + pad * 2
    bezel_h = screen_h + pad + cam_h
    
    frame = Image.new("RGBA", (bezel_w + 120, bezel_h + 30), (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame)
    
    # Outer bezel dark metallic
    bezel_box = [60, 0, 60 + bezel_w, bezel_h]
    draw.rounded_rectangle(bezel_box, radius=18, fill=(28, 28, 32, 255), outline=(60, 60, 65, 255), width=2)
    
    # Camera dot
    cam_x = 60 + bezel_w // 2
    cam_y = 12
    draw.ellipse([cam_x - 4, cam_y - 4, cam_x + 4, cam_y + 4], fill=(12, 12, 14, 255), outline=(45, 45, 50, 255))
    
    # Screen inner image
    resized_screen = screen_img.resize((screen_w, screen_h), Image.Resampling.LANCZOS)
    frame.paste(resized_screen, (60 + pad, cam_h))
    
    # Base hinge
    base_w = bezel_w + 80
    base_h = 16
    base_x = (frame.width - base_w) // 2
    base_y = bezel_h - 2
    draw.rounded_rectangle([base_x, base_y, base_x + base_w, base_y + base_h], radius=8, fill=(65, 65, 70, 255), outline=(85, 85, 90, 255))
    
    # Notch indentation
    notch_w = 140
    notch_x = (frame.width - notch_w) // 2
    draw.rectangle([notch_x, base_y, notch_x + notch_w, base_y + 6], fill=(40, 40, 45, 255))
    
    return frame

def create_phone_mockup(screen_img, target_h=660):
    # Proportions matching flagship smartphone (19.5:9 ratio)
    sw = int(target_h * 0.462)  # ~305px screen width
    sh = target_h               # 660px screen height
    
    pad = 12
    phone_w = sw + pad * 2     # ~329px
    phone_h = sh + pad * 2     # ~684px
    
    margin = 40
    canvas_w = phone_w + margin * 2
    canvas_h = phone_h + margin * 2
    
    frame = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(frame)
    
    bx = margin
    by = margin
    
    # 1. Soft Ambient Drop Shadow with emerald glow
    shadow = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(shadow)
    s_draw.rounded_rectangle([bx + 4, by + 12, bx + phone_w - 4, by + phone_h + 16], radius=48, fill=(0, 0, 0, 160))
    s_draw.rounded_rectangle([bx + 6, by + 6, bx + phone_w - 6, by + phone_h + 6], radius=46, fill=(37, 211, 102, 45))
    shadow = shadow.filter(ImageFilter.GaussianBlur(22))
    frame.alpha_composite(shadow, (0, 0))
    
    # 2. Side Buttons (Physical chassis protrusions)
    btn_col = (48, 50, 56, 255)
    btn_rim = (72, 75, 82, 255)
    draw.rounded_rectangle([bx - 3, by + 90, bx + 1, by + 120], radius=2, fill=btn_col, outline=btn_rim)
    draw.rounded_rectangle([bx - 3, by + 140, bx + 1, by + 190], radius=2, fill=btn_col, outline=btn_rim)
    draw.rounded_rectangle([bx - 3, by + 205, bx + 1, by + 255], radius=2, fill=btn_col, outline=btn_rim)
    draw.rounded_rectangle([bx + phone_w - 1, by + 150, bx + phone_w + 3, by + 225], radius=2, fill=btn_col, outline=btn_rim)
    
    # 3. Outer Titanium Chassis with multi-layer polished bevel
    draw.rounded_rectangle([bx, by, bx + phone_w, by + phone_h], radius=44, fill=(24, 25, 29, 255), outline=(85, 90, 100, 255), width=2)
    draw.rounded_rectangle([bx + 2, by + 2, bx + phone_w - 2, by + phone_h - 2], radius=42, outline=(38, 40, 46, 255), width=1)
    draw.rounded_rectangle([bx + 4, by + 4, bx + phone_w - 4, by + phone_h - 4], radius=40, outline=(14, 15, 17, 255), width=2)
    
    # 4. Inner Screen Area
    sx = bx + pad
    sy = by + pad
    
    resized_screen = screen_img.resize((sw, sh), Image.Resampling.LANCZOS)
    screen_mask = Image.new("L", (sw, sh), 0)
    m_draw = ImageDraw.Draw(screen_mask)
    m_draw.rounded_rectangle([0, 0, sw, sh], radius=34, fill=255)
    frame.paste(resized_screen, (sx, sy), screen_mask)
    
    # 5. Overlays (Dynamic Island, Status bar, Home bar)
    overlay = Image.new("RGBA", (canvas_w, canvas_h), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    # Dynamic Island Pill
    di_w = 96
    di_h = 24
    di_x = sx + (sw - di_w) // 2
    di_y = sy + 9
    ov_draw.rounded_rectangle([di_x, di_y, di_x + di_w, di_y + di_h], radius=12, fill=(4, 4, 6, 255), outline=(22, 22, 28, 255), width=1)
    
    # Front camera dot with blue reflection
    cam_cx = di_x + di_w - 20
    cam_cy = di_y + di_h // 2
    ov_draw.ellipse([cam_cx - 4, cam_cy - 4, cam_cx + 4, cam_cy + 4], fill=(12, 16, 24, 255), outline=(25, 35, 50, 255))
    ov_draw.ellipse([cam_cx - 1, cam_cy - 1, cam_cx + 1, cam_cy + 1], fill=(50, 70, 110, 255))
    ov_draw.ellipse([di_x + 20 - 3, di_y + di_h // 2 - 3, di_x + 20 + 3, di_y + di_h // 2 + 3], fill=(8, 10, 14, 255))
    
    # Status Bar Items
    try:
        f_time = ImageFont.truetype(FONT_TITLE, 12)
    except:
        f_time = ImageFont.load_default()
        
    ov_draw.text((sx + 24, sy + 13), "09:41", font=f_time, fill=(255, 255, 255, 240))
    
    # Signal bars
    sig_x = sx + sw - 64
    sig_y = sy + 15
    for b in range(4):
        h = 3.5 + b * 2.2
        ov_draw.rounded_rectangle([sig_x + b * 4, sig_y + 9 - h, sig_x + b * 4 + 2.5, sig_y + 9], radius=1, fill=(255, 255, 255, 230))
        
    # Wi-Fi icon
    wifi_x = sig_x + 18
    ov_draw.ellipse([wifi_x + 2, sig_y + 6, wifi_x + 6, sig_y + 10], fill=(255, 255, 255, 230))
    ov_draw.arc([wifi_x - 1, sig_y + 1, wifi_x + 9, sig_y + 11], start=210, end=330, fill=(255, 255, 255, 230), width=2)
    
    # Battery icon
    bat_x = wifi_x + 16
    bat_y = sig_y + 1
    ov_draw.rounded_rectangle([bat_x, bat_y, bat_x + 19, bat_y + 10], radius=3, outline=(255, 255, 255, 200), width=1)
    ov_draw.rounded_rectangle([bat_x + 2, bat_y + 2, bat_x + 15, bat_y + 8], radius=1, fill=(52, 199, 89, 240))
    ov_draw.rectangle([bat_x + 19, bat_y + 3, bat_x + 21, bat_y + 7], fill=(255, 255, 255, 180))
    
    # Bottom Home Indicator Bar
    hb_w = 110
    hb_h = 4
    hb_x = sx + (sw - hb_w) // 2
    hb_y = sy + sh - 9
    ov_draw.rounded_rectangle([hb_x, hb_y, hb_x + hb_w, hb_y + hb_h], radius=2, fill=(255, 255, 255, 190))
    
    # Diagonal glass glare
    glare = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glare)
    g_draw.polygon([(0, 0), (sw, 0), (sw, int(sh * 0.35)), (0, int(sh * 0.15))], fill=(255, 255, 255, 12))
    glare_masked = Image.composite(glare, Image.new("RGBA", (sw, sh), (0, 0, 0, 0)), screen_mask)
    frame.paste(glare_masked, (sx, sy), glare_masked)
    
    frame.alpha_composite(overlay, (0, 0))
    return frame

print("Pre-rendering mockups...")
mockup_home = create_laptop_mockup(img_home, 980)
mockup_katalog_small = create_laptop_mockup(img_katalog, 640)
mockup_detail_small = create_laptop_mockup(img_detail, 640)
mockup_tentang = create_laptop_mockup(img_tentang, 800)
# Flagship Phone Mockup with authentic responsive layout
mockup_wa_phone = create_phone_mockup(img_mobile_wa, 660)
mockup_wa_laptop = create_laptop_mockup(img_wa_desktop, 680)

# Pre-render logo
logo_w = 460
logo_h = int(img_logo.height * (logo_w / img_logo.width))
img_logo_resized = img_logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)

# Pre-render subtle ambient background
ambient_base = Image.new("RGBA", (WIDTH, HEIGHT), (10, 15, 13, 255))
glow_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow_layer)
# Top-left forest green aura
gd.ellipse([150, -150, 1050, 750], fill=(24, 96, 73, 50))
# Bottom-right warm amber aura
gd.ellipse([850, 350, 1850, 1250], fill=(217, 131, 39, 45))
glow_blurred = glow_layer.filter(ImageFilter.GaussianBlur(140))
ambient_base.alpha_composite(glow_blurred)

def draw_pill_badge(img, center_x, top_y, text, font, text_color, fill_rgba, stroke_rgba, opacity=1.0):
    if opacity <= 0.01:
        return
    d = ImageDraw.Draw(img)
    bb = d.textbbox((0, 0), text, font=font)
    tw = bb[2] - bb[0]
    th = bb[3] - bb[1]
    px, py = 22, 9
    w = tw + px * 2
    h = th + py * 2
    x = center_x - w // 2
    y = top_y
    
    badge = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bd = ImageDraw.Draw(badge)
    bd.rounded_rectangle([0, 0, w - 1, h - 1], radius=h // 2, 
                         fill=(fill_rgba[0], fill_rgba[1], fill_rgba[2], int(fill_rgba[3] * opacity)),
                         outline=(stroke_rgba[0], stroke_rgba[1], stroke_rgba[2], int(stroke_rgba[3] * opacity)),
                         width=2)
    bd.text((px, py - 1), text, font=font, fill=(text_color[0], text_color[1], text_color[2], int(255 * opacity)))
    img.alpha_composite(badge, (x, y))

def draw_vector_arrow(img, x, y, length=64, thickness=8, head_size=22, color=(37, 211, 102, 255)):
    arr = Image.new("RGBA", (length + 8, head_size * 2 + 8), (0, 0, 0, 0))
    ad = ImageDraw.Draw(arr)
    cy = head_size + 4
    ad.rounded_rectangle([4, cy - thickness // 2, length - head_size + 4, cy + thickness // 2], radius=thickness // 2, fill=color)
    tip = (length + 4, cy)
    top = (length - head_size + 4, cy - head_size)
    bot = (length - head_size + 4, cy + head_size)
    ad.polygon([tip, top, bot], fill=color)
    img.alpha_composite(arr, (x, y - cy))

def ease_out(t):
    return 1 - (1 - t) ** 3

def get_scene_opacity(t, start, end, fade_in=0.8, fade_out=0.8):
    if t < start or t >= end:
        return 0.0
    in_p = max(0.0, min(1.0, (t - start) / fade_in))
    out_p = max(0.0, min(1.0, (end - t) / fade_out))
    return ease_out(min(in_p, out_p))

def render_frame(t):
    # Start with pre-rendered ambient background
    bg = ambient_base.copy()
    draw = ImageDraw.Draw(bg)
    
    # ── Scene 0: Logo Intro (0 to 3.5s) ──
    op0 = get_scene_opacity(t, 0.0, 3.5, 1.0, 0.7)
    if op0 > 0.01:
        prog = min(1.0, t / 1.5)
        scale_f = 0.85 + 0.15 * ease_out(prog)
        lw = int(img_logo_resized.width * scale_f)
        lh = int(img_logo_resized.height * scale_f)
        scaled_logo = img_logo_resized.resize((lw, lh), Image.Resampling.LANCZOS)
        
        alpha_mask = scaled_logo.split()[3].point(lambda p: int(p * op0))
        lx = (WIDTH - lw) // 2
        ly = (HEIGHT - lh) // 2 - 40
        bg.paste(scaled_logo, (lx, ly), alpha_mask)
        
        tag = "ETALASE DIGITAL UMKM LOKAL"
        tb = draw.textbbox((0, 0), tag, font=f_brand)
        tw = tb[2] - tb[0]
        tx = (WIDTH - tw) // 2
        ty = ly + lh + 30
        draw.text((tx, ty), tag, font=f_brand, fill=(160, 175, 168, int(220 * op0)))
    
    # ── Scene 1: Beranda & Masalah (3.5 to 17.5s) ──
    op1 = get_scene_opacity(t, 3.5, 17.5, 0.8, 0.8)
    if op1 > 0.01:
        draw_pill_badge(bg, WIDTH // 2, 84, "BERANDA LAPAKKITA", f_badge,
                        (74, 148, 62), (74, 148, 62, 35), (74, 148, 62, 140), op1)
        
        h1 = "Karya Anak Bangsa, Kualitas Juara, Harga Bersahaja"
        hb = draw.textbbox((0, 0), h1, font=f_h1)
        draw.text(((WIDTH - (hb[2] - hb[0])) // 2, 150), h1, font=f_h1, fill=(245, 245, 245, int(255 * op1)))
        
        ly = int(260 + (1 - ease_out(min(1.0, (t - 3.5) / 1.0))) * 50)
        lx = (WIDTH - mockup_home.width) // 2
        alpha_m = mockup_home.split()[3].point(lambda p: int(p * op1))
        bg.paste(mockup_home, (lx, ly), alpha_m)
    
    # ── Scene 2: Solusi & Kurasi (Fitur 01) (17.5 to 32.0s) ──
    op2 = get_scene_opacity(t, 17.5, 32.0, 0.8, 0.8)
    if op2 > 0.01:
        draw_pill_badge(bg, WIDTH // 2, 84, "FITUR 01 — KURASI & VERIFIKASI ADMIN", f_badge,
                        (74, 148, 62), (74, 148, 62, 35), (74, 148, 62, 140), op2)
        
        h1 = "Setiap Produk Diverifikasi Langsung oleh Tim Admin"
        hb = draw.textbbox((0, 0), h1, font=f_h1)
        draw.text(((WIDTH - (hb[2] - hb[0])) // 2, 150), h1, font=f_h1, fill=(245, 245, 245, int(255 * op2)))
        
        mock_left = mockup_katalog_small
        mock_right = mockup_detail_small
        
        alpha_l = mock_left.split()[3].point(lambda p: int(p * op2))
        alpha_r = mock_right.split()[3].point(lambda p: int(p * op2))
        
        bg.paste(mock_left, (160, 275), alpha_l)
        bg.paste(mock_right, (980, 275), alpha_r)
        
        v_badge = Image.new("RGBA", (340, 48), (0, 0, 0, 0))
        v_draw = ImageDraw.Draw(v_badge)
        v_draw.rounded_rectangle([0, 0, 339, 47], radius=14, fill=(74, 148, 62, int(230 * op2)))
        # Vector checkmark icon circle
        v_draw.ellipse([16, 12, 38, 34], fill=(255, 255, 255, int(255 * op2)))
        v_draw.line([(22, 23), (26, 27), (32, 17)], fill=(74, 148, 62, int(255 * op2)), width=3)
        v_draw.text((46, 10), "Terverifikasi Admin", font=f_badge, fill=(255, 255, 255, int(255 * op2)))
        bg.alpha_composite(v_badge, (1320, 245))
    
    # ── Scene 3: Direct WhatsApp Order (Fitur 02) (32.0 to 41.5s) ──
    op3 = get_scene_opacity(t, 32.0, 41.5, 0.8, 0.8)
    if op3 > 0.01:
        draw_pill_badge(bg, WIDTH // 2, 84, "FITUR 02 — DIRECT WHATSAPP ORDER", f_badge,
                        (37, 211, 102), (37, 211, 102, 35), (37, 211, 102, 150), op3)
        
        h1 = "Satu Klik Langsung Terhubung ke WhatsApp Penjual"
        hb = draw.textbbox((0, 0), h1, font=f_h1)
        draw.text(((WIDTH - (hb[2] - hb[0])) // 2, 150), h1, font=f_h1, fill=(245, 245, 245, int(255 * op3)))
        
        # Phone on left (balanced layout)
        alpha_p = mockup_wa_phone.split()[3].point(lambda p: int(p * op3))
        bg.paste(mockup_wa_phone, (280, 230), alpha_p)
        
        # Vector arrow connecting phone and laptop
        draw_vector_arrow(bg, 715, 560, length=70, thickness=10, head_size=24, color=(37, 211, 102, int(255 * op3)))
        
        # Laptop on right
        alpha_wl = mockup_wa_laptop.split()[3].point(lambda p: int(p * op3))
        bg.paste(mockup_wa_laptop, (820, 280), alpha_wl)
    
    # ── Scene 4: Dashboard Mandiri (Fitur 03) (41.5 to 50.5s) ──
    op4 = get_scene_opacity(t, 41.5, 50.5, 0.8, 0.8)
    if op4 > 0.01:
        draw_pill_badge(bg, WIDTH // 2, 84, "FITUR 03 — DASHBOARD MANDIRI", f_badge,
                        (217, 131, 39), (217, 131, 39, 35), (217, 131, 39, 150), op4)
        
        h1 = "Upload Mudah & Pantau Minat Pelanggan Real-Time"
        hb = draw.textbbox((0, 0), h1, font=f_h1)
        draw.text(((WIDTH - (hb[2] - hb[0])) // 2, 150), h1, font=f_h1, fill=(245, 245, 245, int(255 * op4)))
        
        alpha_t = mockup_tentang.split()[3].point(lambda p: int(p * op4))
        bg.paste(mockup_tentang, (180, 270), alpha_t)
        
        cx = 1200
        cy = 380
        c_card = Image.new("RGBA", (340, 260), (0, 0, 0, 0))
        cd = ImageDraw.Draw(c_card)
        cd.rounded_rectangle([0, 0, 339, 259], radius=24, fill=(20, 25, 23, int(240 * op4)),
                             outline=(217, 131, 39, int(150 * op4)), width=2)
        cd.text((50, 30), "Total Minat Pembeli", font=f_sub, fill=(160, 175, 168, int(220 * op4)))
        
        cp = min(1.0, max(0.0, (t - 41.5) / 5.0))
        c_val = str(int(40 + cp * 108))
        cd.text((100, 85), c_val, font=f_counter, fill=(217, 131, 39, int(255 * op4)))
        
        cd.rounded_rectangle([20, 185, 320, 230], radius=20, fill=(74, 148, 62, int(40 * op4)),
                             outline=(74, 148, 62, int(100 * op4)), width=1)
        tb_w = cd.textbbox((0, 0), "Klik WhatsApp Terdeteksi", font=f_sub_small)
        tw = tb_w[2] - tb_w[0]
        tx = (340 - tw) // 2
        cd.ellipse([tx - 16, 203, tx - 6, 213], fill=(74, 148, 62, int(255 * op4)))
        cd.text((tx, 198), "Klik WhatsApp Terdeteksi", font=f_sub_small, fill=(74, 148, 62, int(255 * op4)))
        bg.alpha_composite(c_card, (cx, cy))
    
    # ── Scene 5: Outro & Call to Action (50.5 to 63.5s) ──
    op5 = get_scene_opacity(t, 50.5, 63.5, 0.8, 0.8)
    if op5 > 0.01:
        draw_pill_badge(bg, WIDTH // 2, 130, "DARI UMKM UNTUK INDONESIA", f_badge,
                        (74, 148, 62), (74, 148, 62, 35), (74, 148, 62, 140), op5)
        
        h1 = "Saatnya Produk Lokalmu Naik Kelas!"
        hb = draw.textbbox((0, 0), h1, font=f_h1)
        draw.text(((WIDTH - (hb[2] - hb[0])) // 2, 210), h1, font=f_h1, fill=(245, 245, 245, int(255 * op5)))
        
        sub = "Dukung perekonomian bangsa dengan belanja dari pedagang dan produsen lokal."
        sb = draw.textbbox((0, 0), sub, font=f_sub)
        draw.text(((WIDTH - (sb[2] - sb[0])) // 2, 300), sub, font=f_sub, fill=(160, 175, 168, int(220 * op5)))
        
        dom_txt = "www.lapakkita.my.id"
        db = draw.textbbox((0, 0), dom_txt, font=f_url)
        dw = db[2] - db[0]
        dx = (WIDTH - dw) // 2
        dy = 420
        d_card = Image.new("RGBA", (dw + 104, 94), (0, 0, 0, 0))
        dd = ImageDraw.Draw(d_card)
        dd.rounded_rectangle([0, 0, dw + 103, 93], radius=24, fill=(20, 28, 24, int(240 * op5)),
                             outline=(74, 148, 62, int(160 * op5)), width=3)
        dd.text((52, 25), dom_txt, font=f_url, fill=(74, 148, 62, int(255 * op5)))
        bg.alpha_composite(d_card, (dx - 52, dy - 20))
        
        cta_txt = "Daftarkan Usahamu Gratis"
        cb = draw.textbbox((0, 0), cta_txt, font=f_cta)
        cw = cb[2] - cb[0]
        cx = (WIDTH - cw) // 2
        cy = 580
        pulse = int(4 * math.sin(t * 4))
        
        btn_w = cw + 80 + pulse * 2
        btn_h = 76 + pulse * 2
        btn_img = Image.new("RGBA", (btn_w, btn_h), (0, 0, 0, 0))
        btnd = ImageDraw.Draw(btn_img)
        btnd.rounded_rectangle([0, 0, btn_w - 1, btn_h - 1], radius=20, fill=(217, 131, 39, int(255 * op5)))
        btnd.text((40 + pulse, 18 + pulse), cta_txt, font=f_cta, fill=(255, 255, 255, int(255 * op5)))
        bg.alpha_composite(btn_img, (cx - 40 - pulse, cy - 16 - pulse))
    
    # ── Scene 6: Final Logo Outro (63.5 to 68.0s) ──
    op6 = get_scene_opacity(t, 63.5, 68.0, 0.8, 0.8)
    if op6 > 0.01:
        lx = (WIDTH - img_logo_resized.width) // 2
        ly = 380
        alpha_l = img_logo_resized.split()[3].point(lambda p: int(p * op6))
        bg.paste(img_logo_resized, (lx, ly), alpha_l)
        
        tag = "Etalase Digital Produk UMKM Lokal"
        tb = draw.textbbox((0, 0), tag, font=f_brand)
        tw = tb[2] - tb[0]
        draw.text(((WIDTH - tw) // 2, ly + img_logo_resized.height + 25), tag, font=f_brand, fill=(160, 175, 168, int(200 * op6)))
        
        url_t = "lapakkita.my.id"
        ub = draw.textbbox((0, 0), url_t, font=f_sub_bold)
        draw.text(((WIDTH - (ub[2] - ub[0])) // 2, ly + img_logo_resized.height + 75), url_t, font=f_sub_bold, fill=(74, 148, 62, int(255 * op6)))
    
    # ── Subtitles Overlay Bar (Bottom) ──
    active_sub = None
    for st, et, txt in SUBTITLES:
        if st <= t < et:
            active_sub = txt
            break
            
    if active_sub:
        sb = draw.textbbox((0, 0), active_sub, font=f_sub)
        sw = sb[2] - sb[0]
        sh = sb[3] - sb[1]
        sx = (WIDTH - sw) // 2
        sy = 970
        sub_card = Image.new("RGBA", (sw + 72, sh + 30), (0, 0, 0, 0))
        sd = ImageDraw.Draw(sub_card)
        sd.rounded_rectangle([0, 0, sw + 71, sh + 29], radius=16, fill=(10, 14, 12, 235), outline=(255, 255, 255, 35), width=1)
        sd.text((36, 14), active_sub, font=f_sub, fill=(255, 255, 255, 255))
        bg.alpha_composite(sub_card, (sx - 36, sy - 14))
        
    return np.array(bg.convert("RGB"))

if __name__ == "__main__":
    print("Testing single frame render at t=36.0s (Scene 3)...")
    test_f = render_frame(36.0)
    Image.fromarray(test_f).save("test_rendered_scene3.png")
    print("Test frame saved to test_rendered_scene3.png")
    
    print("Starting video rendering via FFmpeg pipe...")
    output_video_path = os.path.join(PUBLIC_DIR, "lapakita_video_demo_1080p.mp4")
    
    cmd_video = [
        ffmpeg_bin, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-i", combined_audio,
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "medium",
        "-crf", "20",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        output_video_path
    ]
    
    process = subprocess.Popen(cmd_video, stdin=subprocess.PIPE)
    
    for f in range(TOTAL_FRAMES):
        time_sec = f / FPS
        frame_arr = render_frame(time_sec)
        process.stdin.write(frame_arr.tobytes())
        if f % 150 == 0:
            pct = (f / TOTAL_FRAMES) * 100
            print(f"Render progress: {pct:.1f}% ({f}/{TOTAL_FRAMES})")
    
    process.stdin.close()
    process.wait()
    print(f"Video export complete! File saved at: {output_video_path}")
