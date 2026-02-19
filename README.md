# 🚀 نشر MIKE على Vercel — خطوة بخطوة

## الملفات المطلوبة (3 ملفات فقط)
```
podcast-ai/
├── index.html        ← الواجهة الكاملة
├── api/
│   └── chat.js       ← السيرفر الوسيط (يخفي مفتاح API)
└── vercel.json       ← إعدادات Vercel
```

---

## الخطوات

### 1. حمّل Vercel CLI
```bash
npm install -g vercel
```

### 2. سجّل دخول
```bash
vercel login
```
(سيفتح المتصفح، سجّل بحساب GitHub أو Email)

### 3. انشر المشروع
```bash
cd podcast-ai
vercel --prod
```

### 4. ضع مفتاح API في Vercel (الخطوة المهمة)
بعد النشر، افتح:
👉 https://vercel.com/dashboard → مشروعك → Settings → Environment Variables

أضف:
- **Name:** `ANTHROPIC_API_KEY`
- **Value:** `sk-ant-api03-...` (مفتاحك كاملاً)
- **Environment:** Production ✓, Preview ✓

ثم اضغط **Save** وأعد النشر:
```bash
vercel --prod
```

### 5. خلاص! 🎉
سيعطيك Vercel رابط مثل:
`https://mike-podcast.vercel.app`

---

## الأمان 🔒
- ✅ المفتاح مخزّن في Vercel فقط — لا يراه أحد
- ✅ الكود الأمامي (index.html) لا يحتوي أي مفتاح
- ✅ السيرفر الوسيط (api/chat.js) هو الوحيد الذي يكلم Anthropic

---

## للتطوير المحلي
```bash
vercel dev
```
(يشغّل السيرفر محلياً على port 3000)
