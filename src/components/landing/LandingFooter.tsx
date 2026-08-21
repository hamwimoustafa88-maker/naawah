export function LandingFooter() {
  return (
    <footer className="w-full border-t border-(--home-border) bg-(--home-bg) px-6 py-10 text-center">
      <p className="mx-auto max-w-lg text-xs text-(--home-muted)">
        ملاحظة هامة: باستخدامك لهذا التطبيق فإنك تتعهد بصحة المعلومات والبيانات الواردة في تصميم النعوة.
      </p>
      <p className="mt-4 text-xs text-(--home-muted)">© {new Date().getFullYear()} النعوة الإلكترونية</p>
    </footer>
  )
}
