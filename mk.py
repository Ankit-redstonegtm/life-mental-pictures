from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random
W,H=1024,768
def grad(top,bot):
    im=Image.new("RGB",(W,H));d=ImageDraw.Draw(im)
    for y in range(H):
        t=y/H;d.line([(0,y),(W,y)],fill=tuple(int(top[i]*(1-t)+bot[i]*t) for i in range(3)))
    return im
def tag(im,t):
    d=ImageDraw.Draw(im);f=ImageFont.load_default(size=22)
    d.rounded_rectangle([20,H-58,560,H-18],14,fill=(0,0,0,));d.text((36,H-50),t,font=f,fill=(255,255,255))
def palms(d,xs,base):
    for x in xs:
        d.line([(x,base),(x+20,base-300)],fill=(15,25,30),width=10)
        for a in (-150,-100,-40,10,60,110):
            d.line([(x+20,base-300),(x+20+a,base-300+abs(a)//3+30)],fill=(15,25,30),width=7)
# 1 sunrise beach/coworking
im=grad((255,140,90),(40,60,110));d=ImageDraw.Draw(im)
d.ellipse([400,330,620,550],fill=(255,225,150))
d.rectangle([0,480,W,H],fill=(20,60,90))
for i in range(12):d.line([(380+i*20,500+i*14),(640-i*20,500+i*14)],fill=(255,200,140),width=3)
palms(d,[120,880],620);im=im.filter(ImageFilter.GaussianBlur(1.2));tag(im,"PLACEHOLDER 1/3 · golden-hour arrival");im.save("images/network-school-1.jpg",quality=88)
# 2 night city lights, laptop desk
im=grad((15,15,50),(90,40,110));d=ImageDraw.Draw(im);random.seed(3)
for x in range(0,W,60):
    h=random.randint(150,420);d.rectangle([x,H-h,x+54,H],fill=(12,12,30))
    for _ in range(h//30):
        wx=x+6+random.randint(0,36);wy=H-random.randint(30,h-10);d.rectangle([wx,wy,wx+8,wy+10],fill=(255,215,130))
d.ellipse([780,70,860,150],fill=(240,240,255));d.rectangle([0,600,W,H],fill=(30,20,40))
d.polygon([(330,600),(700,600),(660,470),(370,470)],fill=(60,60,80));d.polygon([(380,480),(650,480),(630,560),(400,560)],fill=(120,200,255))
im=im.filter(ImageFilter.GaussianBlur(1));tag(im,"PLACEHOLDER 2/3 · late-night building");im.save("images/network-school-2.jpg",quality=88)
# 3 friends campfire/dinner
im=grad((30,20,45),(120,50,40));d=ImageDraw.Draw(im)
for r,c in [(260,(120,50,30)),(180,(200,90,30)),(110,(255,170,60)),(50,(255,235,150))]:
    d.ellipse([512-r,560-r,512+r,560+r],fill=c)
im=im.filter(ImageFilter.GaussianBlur(25));d=ImageDraw.Draw(im)
for x in [180,330,700,850]:
    d.ellipse([x-35,430,x+35,500],fill=(15,10,20));d.rounded_rectangle([x-55,500,x+55,700],40,fill=(15,10,20))
rnd=random.Random(1)
for _ in range(60):x,y=rnd.randint(0,W),rnd.randint(0,300);d.ellipse([x,y,x+3,y+3],fill=(255,255,220))
tag(im,"PLACEHOLDER 3/3 · dinner with friends");im.save("images/network-school-3.jpg",quality=88)
