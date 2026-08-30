# إعداد أرشفة Google Drive

يشرح هذا الملف خطوات إعداد حساب Google (مرة واحدة) اللازم لأرشفة النعوات المُصدَّرة تلقائياً.

## لماذا OAuth لا Service Account؟

Service Account لا يملك مساحة تخزين خاصة به في Google Drive — أي رفع ملف باسمه على
حساب Gmail شخصي يُرفض بخطأ حصة تخزين (quota). الحل الوحيد لحساب Gmail شخصي هو
OAuth عادي مع `refresh_token` طويل الأمد.

## الخطوات

1. **Google Cloud Console** (https://console.cloud.google.com):
   - أنشئ مشروعاً جديداً (أو استعمل موجوداً).
   - من "APIs & Services" → "Library" → فعّل **Google Drive API**.

2. **OAuth consent screen**:
   - النوع: **External**.
   - املأ الحقول الإلزامية (اسم التطبيق، إيميل الدعم...).
   - النطاق (Scope) المطلوب هنا هو `.../auth/drive.file` فقط — نطاق **غير حسّاس**
     (non-sensitive)، فلا يحتاج مراجعة يدوية من Google.
   - ⚠️ **الأهم**: بعد الإنشاء، غيّر "Publishing status" من "Testing" إلى
     **"In production"**. في وضع Testing ينتهي الـ`refresh_token` تلقائياً بعد
     **٧ أيام فقط**، فيتوقف الأرشيف بصمت (التصدير للمستخدمين يستمر بلا أي عطل
     ظاهر — فقط الرفع إلى Drive يفشل صامتاً). النشر فوري بلا انتظار مراجعة لأن
     النطاق غير حسّاس.

3. **Credentials** → **Create Credentials** → **OAuth client ID**:
   - نوع التطبيق: **Desktop app**.
   - انسخ **Client ID** و**Client Secret**.

4. **تشغيل السكربت المساعد**:
   ```bash
   npx tsx scripts/google-drive-setup.ts
   ```
   يطلب منك Client ID/Secret، يفتح رابط موافقة (افتحه في متصفحك ووافق بحساب
   Gmail الذي تريد أرشفة النعوات فيه)، ثم يلتقط الرمز تلقائياً وينشئ مجلد
   الأرشيف ("أرشيف النعوة الإلكترونية") ويطبع القيم الأربعة الجاهزة للّصق في `.env`.

5. الصق القيم الأربعة المطبوعة في `.env` (محلياً) وفي متغيّرات البيئة على Vercel
   (أو أي منصّة استضافة) تحت نفس الأسماء:
   ```
   GOOGLE_DRIVE_CLIENT_ID=
   GOOGLE_DRIVE_CLIENT_SECRET=
   GOOGLE_DRIVE_REFRESH_TOKEN=
   GOOGLE_DRIVE_FOLDER_ID=
   ```

## ملاحظات

- إن رفض السكربت إعادة `refresh_token` (رسالة "لم يُعَد refresh_token")، فهذا يعني
  أن التطبيق قد وافق عليه هذا الحساب من قبل. أبطل الوصول من
  https://myaccount.google.com/permissions ثم أعد تشغيل السكربت.
- تدوير الـ`refresh_token` (تسريب مثلاً) هو نفس خطوة الإبطال أعلاه ثم إعادة تشغيل
  السكربت من جديد.
- حذف أي من المتغيّرات الأربعة من البيئة يوقف الأرشفة بصمت بلا أي أثر على التصدير
  نفسه (راجع `isDriveConfigured()` في `src/lib/drive/client.ts`).
