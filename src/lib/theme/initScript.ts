// يقرأ تفضيل الوضع المظلم من localStorage ويضبطه على <html> قبل أول رسم — يمنع
// وميض الألوان عند التحميل. يُستهلَك مرّة واحدة فقط عبر <Script strategy="beforeInteractive">
// في app/layout.tsx (لا في كل صفحة على حدة) — التخطيط الجذري لا يُعاد رسمه أثناء
// تنقّل Next.js من جانب العميل بين "/" و"/create"، فنسخة واحدة هنا تخدم كليهما.
// **لا** تُرجِع هذا إلى <script dangerouslySetInnerHTML> خام داخل page.tsx: React
// يرفض تنفيذ وسم <script> يُصادفه أثناء رسم من جانب العميل (يظهر تحذير "Encountered
// a script tag while rendering" في الطرفية)، وهو ما كان يحدث فعلياً هنا سابقاً.
export const THEME_INIT_SCRIPT = `
try {
  if (localStorage.getItem("home-theme") === "dark") {
    document.documentElement.dataset.theme = "dark";
  }
} catch (e) {}
`
