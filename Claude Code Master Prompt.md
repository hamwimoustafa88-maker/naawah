# **SYSTEM PROMPT FOR CLAUDE CODE: E-OBITUARY GENERATOR (تطبيق النعوة الإلكترونية)**

## **1\. PROJECT OVERVIEW & ARCHITECTURE**

You are an expert Senior Full-Stack Engineer, Cultural Protocol Strategist, and UX/UI Designer. Build a full-stack, highly accessible, elegant, and culturally dignified web application called **"النعوة الإلكترونية" (Digital Funeral Notice Generator)**.

### **Core Tech Stack Requirements:**

* **Framework:** Next.js 14+ (App Router, Server Actions, TypeScript)  
* **Styling:** Tailwind CSS \+ Shadcn UI \+ Lucide Icons \+ Framer Motion for smooth transitions.  
* **Database & ORM:** Prisma ORM connected to PostgreSQL (Neon / Supabase).  
* **Deployment:** Vercel ready.  
* **Export Capabilities:** Client-side A4 PDF and High-DPI PNG/JPEG image rendering (html-to-image or html2canvas \+ jspdf).  
* **Data Import/Export:** SheetJS (xlsx) for Excel import/export.  
* **Date Handling:** moment-hijri or date-fns-jalali for Gregorian-to-Hijri conversion with manual \+/- 1 day adjust offset.  
* **Font Stack:** Premium Arabic Typography (Amiri, Noto Naskh Arabic, Tajawal, Cairo, and Traditional Arabic Calligraphy SVGs).

## **2\. DATABASE SCHEMA (Prisma \- prisma/schema.prisma)**

Define the Prisma schema for analytics and template metadata without storing sensitive PII publicly:

datasource db {  
  provider \= "postgresql"  
  url      \= env("DATABASE\_URL")  
}

generator client {  
  provider \= "prisma-client-js"  
}

model ObituaryStat {  
  id         String   @id @default(cuid())  
  createdAt  DateTime @default(now())  
  ipHash     String?  // Hashed IP for region analytics  
  country    String?  // Arab country code or name  
  region     String?  // City/Region  
  templateId String   // Template used  
}

model Template {  
  id          String   @id @default(cuid())  
  name        String  
  category    String   // Traditional, Modern, Minimalist, Royal  
  bgStyle     String   // CSS / Frame SVG reference  
  isDefault   Boolean  @default(false)  
  createdAt   DateTime @default(now())  
}

## **3\. PAGE STRUCTURE & USER INTERFACE REQUIREMENTS**

### **A. Landing Page (الصفحة الرئيسية)**

1. **Hero Section:**  
   * **Main Heading:** "تطبيق النعوة الإلكترونية \- إعلان مواساة بروح عصر رقمي وقور"  
   * **Counter Badge:** Real-time dynamic counter showing "عدد النعوات المُنقذة للبيئة: \[Total Count from Prisma Stat Count\]".  
   * **Primary CTA Button:** "إنشاء نعوة الآن" (Scrolls to or opens Editor).  
   * **Feature Highlights (Bento Grid Layout):**  
     * ⚡ **مجاني وبلاد حدود:** يعمل من المتصفح مباشرة.  
     * 🚀 **بدون تسجيل:** بلا تنزيل وبلا تسجيل حساب.  
     * 🌿 **صديق للبيئة:** الحد من استخدام الورق بدلاً من طباعة مئات النسخ. أنشئ نعوة رقمية وشاركها مع من يلزم في لحظات.  
     * 📖 **احترام القرآن الكريم:** تجنب رمي الأوراق التي تحوي آيات قرآنية بتحويل النعوة إلى صورة رقمية محفوظة بمحبة.  
     * 🔒 **خصوصية مطلقة:** المشاركة والتحميل يتمّان من هاتفك أو حاسوبك أنت. لا ننشر نَعوتكم على روابط عامة.  
     * 🎨 **قوالب تلائم الذوق الإسلامي:** اختر من مكتبة تصاميم هادئة ومحترمة، ثم عدّل النصوص وحمّل النتيجة.  
2. About Section **(من نحن):**  
   * Narrative on modernizing traditional obituaries with Islamic cultural reverence.  
3. **Contact Section (اتصل بنا):**  
   * Clean contact form with feedback submission.

### **B. Interactive Editor Section (قسم إنشاء وتعديل النعوة)**

Layout: **Dual Panel View**

* **Desktop:** Left side \= Multi-step Form Controls; Right side \= Sticky Live Canvas Preview (Real-time update).  
* **Mobile:** Tabbed View ("تعديل البيانات" / "المعاينة الحية") \+ Floating Action Bar for Download/Share.

#### **1\. Data Input Form (محرر البيانات)**

##### **Step 1: بيانات الفقيد (Deceased Details)**

* **الجنس (Gender):** Radio Select (ذكر / أنثى).  
* **الاسم الثلاثي للفقيد (Full Name):** Text Input.  
* **اللقب أو الصفة والكنية (Title / Honorific):** Dropdown \+ Custom Input.  
  * Examples: الحاج, المربي, المربي الفاضل, الداعية, الطبيب, المحامي, المهندس, المجاهد, المحافظ, مدير إدارة, الشهيد, حرم المغفور له (اسم الزوج).  
  * Include spouse name logic if deceased is female: حرم المرحوم / المغفور له \[اسم الزوج\].  
* **العائلات (Families Involved):** Text Input (e.g., "آل حداد وآل خربوطلي وآل البابا").  
* **تاريخ الوفاة (Gregorian Date):** Date Picker \-\> Auto-converts to Hijri Date with manual \+/- 1 day adjust offset button.  
* **مكان الوفاة (Location):**  
  * Dropdown select for Arab Countries (لبنان, سوريا, الأردن, مصر, السعودية, الإمارات, العراق, إلخ).  
  * Dependent Sub-region / Major Cities dropdown.  
  * Save IP Address Hash to Prisma database for location/regional statistics.  
* **تاريخ الولادة والعمر (Birth Date & Calculated Age):** Date Picker \-\> Automatically calculates age in years and calculates day of death (e.g., "يوم الأربعاء").  
* **صورة الفقيد (Photo Upload):** Optional image upload with local browser cropper / rounded frame option.  
* **المخطوطة القرآنية (Quranic Calligraphy Header):**  
  * Dropdown selector for Quranic verses (e.g., "يَا أَيَّتُهَا النَّفْسُ الْمُطْمَئِنَّةُ...", "وَبَشِّرِ الصَّابِرِينَ...", "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ...").

##### **Step 2: تفاصيل الجنازة والتعزية (Condolences & Procession)**

* الجهة الناعية (Mourning Body / **Institution Header):** Optional field at top (e.g., "تنعي وزارة التربية...", "تنعي نقابة المهندسين...").  
* **من أين سيشيع جثمانه:** Text input (e.g., "من منزله الكائن في حي الكاملية عند أذان العصر").  
* **موعد ومعلومات صلاة الجنازة:** Text input (e.g., "في جامع الإمام علي بعد صلاة الظهر").  
* **التعزية العامة:** Text Area (e.g., "التعزية للرجال وللنساء يوم الجمعة في قاعة مسجد السلام — من بعد صلاة العصر لغاية ٧ مساءً").  
* **تفاصيل تعزية الرجال (اختياري):** Location, Days, Hours.  
* **تفاصيل تعزية النساء (اختياري):** Location, Days, Hours.  
* **معلومات إضافية في أسفل النعوة:** Text area for extra notes (e.g., "الراضون بمشيئة الله...").

##### **Step 3: أقارب الفقيد وترتيب الأنساب والبروتوكول الاجتماعي (Family Hierarchy & Honorifics)**

Implement a dynamic **Protocol Re-orderable List** for relatives:

* **Categories available:**  
  * والدها / والده, والدتها / والدته  
  * زوجها / زوجته  
  * أولاده / الأبناء (ترتيب الأكبر إلى الأصغر)  
  * بناته (ترتيب الأكبر إلى الأصغر)  
  * أشقاؤه / الأشقاء, شقيقاته / الشقيقات  
  * أحفاده / الأحفاد  
  * أعمامه / الأعمام, أبناء الأعمام  
  * أخواله / الأخوال, أبناء الأخوال  
  * أبناء الأشقاء, أبناء الشقيقات  
  * الأصهار, الأنسباء, أزواج الشقيقات  
* **Dynamic Controls:** Allow adding new custom fields or removing existing categories. Leave empty to hide from design.  
* **Protocol Honorific Rules Guidance & UX Tooltips:**  
  * Support individual honorific titles for each relative: (الدكتور, المهندس, المحامي, الأستاذ, المربي الفاضل, الشيخ العلامة الفقيه المحدث, الوزير السابق...).  
  * Military Ranks Protocol:  
    * If retired Lieutenant/Lieutenant First Class \-\> Display الضابط المتقاعد \[الاسم\].  
    * If retired Brigadier General or Major General \-\> Display العميد المتقاعد \[الاسم\] or اللواء المتقاعد \[الاسم\].  
  * Social & Official Positions: Include position titles prior to name like a hiring CV (e.g., سعادة الوزير السابق \[الاسم\]).

##### **Step 4: اختيار القالب (Template Selection)**

Provide multiple distinct Islamic Dignified Templates:

1. **الكلاسيكي الذهبي (Traditional Islamic Gold Frame)**  
2. **الهادئ الأخضر الزيتي (Olive Minimalist)**  
3. **الزجاجي الحديث (Modern Dark/Light Glassmorphism)**  
4. **الخط الثلث المترادف (Traditional Thuluth Calligraphy Focus)**  
5. **البروتوكولي الملكي (Royal Arabic Monogram)**

### **C. Import / Export & Actions (التصدير والاستيراد)**

1. **Live Preview Panel:** Render canvas on the right side with high-resolution SVG backgrounds, crisp Arabic typography, and real-time updates.  
2. **Export Actions:**  
   * 🖼️ **تحميل صورة (PNG/JPEG):** High-DPI resolution download directly to user device.  
   * 📄 **تحميل ملف A4 PDF:** Pixel-perfect printable PDF document (jspdf \+ canvas).  
   * 📱 **مشاركة مباشرة (Web Share API):** Native share sheet to WhatsApp, Telegram, or Email.  
   * 📊 **تصدير إكسيل (Export XLSX):** Save all entered structured data locally into an .xlsx file (SheetJS).  
   * 📥 **استيراد إكسيل (Import XLSX):** Upload .xlsx file to instantly pre-fill all form fields.

## **4\. STRICT TECHNICAL RULES & LEGAL DISCLAIMER**

1. **Client-Side Data Privacy Guarantee:**  
   * Deceased photos and dynamic personal content MUST be rendered locally in the browser using HTML5 Canvas or SVG conversion libraries. DO NOT upload personal obituary data to public storage servers.  
2. **IP & Geo Analytics Telemetry:**  
   * Create an API route /api/stats/increment that records anonymized country, region, and template usage telemetry to Prisma DB when an obituary is downloaded/generated.  
3. **Legal Disclaimer Footer Requirement:**  
   * Always display notice at the bottom of the editor & footer:**"ملاحظة هامة: باستخدامك لهذا التطبيق فإنك تتعهد بصحة المعلومات والبيانات الواردة في تصميم النعوة."**

## **5\. STEP-BY-STEP IMPLEMENTATION PLAN FOR CLAUDE CODE**

1. Initialize Next.js 14 App Router project with Tailwind CSS, Shadcn UI, and Lucide Icons.  
2. Set up prisma/schema.prisma and dynamic API route \`/api/stats/increment