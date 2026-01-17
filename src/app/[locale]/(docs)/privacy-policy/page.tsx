// import { Metadata } from "next";
// import { getMetadataPrivacyPolicy } from "@/getMetaData";

// export function generateMetadata({
//   params,
// }: {
//   params: { locale: string };
// }): Metadata {
//   return getMetadataPrivacyPolicy({
//     params,
//   });
// }

const PrivacyPolicy = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;

  return (
    <main>
      {params.locale === "ar" ? (
        <section className="container py-24 prose ">
          <h1>سياسة الخصوصية</h1>
          <h2>1. جمع المعلومات</h2>
          <p>نحن نجمع المعلومات التي تقدمها لنا مباشرة عند:</p>
          <ul>
            <li>إنشاء حساب على المنصة</li>
            <li>شراء الكورسات التعليمية</li>
            <li>التواصل مع فريق الدعم</li>
            <li>استخدام خدماتنا التعليمية</li>
          </ul>
          <h2>2. استخدام المعلومات</h2>
          <p>نستخدم المعلومات التي نجمعها لـ:</p>
          <ul>
            <li>تقديم وتحسين خدماتنا التعليمية</li>
            <li>التواصل معك بخصوص حسابك والكورسات</li>
            <li>تخصيص تجربة التعلم الخاصة بك</li>
            <li>حماية أمن وسلامة منصتنا</li>
          </ul>
          <h2>3. حماية المعلومات</h2>
          <p>نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من:</p>
          <ul>
            <li>الوصول غير المصرح به</li>
            <li>التعديل غير المصرح به</li>
            <li>الإفصاح أو الإتلاف غير المصرح به</li>
          </ul>
          <h2>4. مشاركة المعلومات</h2>
          <p>
            لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:
          </p>
          <ul>
            <li>بموافقتك الصريحة</li>
            <li>لأغراض قانونية</li>
            <li>
              مع مقدمي الخدمات الموثوق بهم الذين يساعدوننا في تشغيل منصتنا
            </li>
          </ul>
          <h2>5. حقوقك</h2>
          <p>لديك الحق في:</p>
          <ul>
            <li>الوصول إلى معلوماتك الشخصية</li>
            <li>تصحيح معلوماتك غير الدقيقة</li>
            <li>طلب حذف معلوماتك</li>
            <li>الاعتراض على معالجة معلوماتك</li>
          </ul>
        </section>
      ) : (
        <section className="container py-24 prose ">
          <h1>Privacy Policy</h1>
          <h2>1. Information Collection</h2>
          <p>We collect information that you provide directly to us when:</p>
          <ul>
            <li>Creating an account on the platform</li>
            <li>Purchasing educational courses</li>
            <li>Communicating with the support team</li>
            <li>Using our educational services</li>
          </ul>
          <h2>2. Use of Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide and improve our educational services</li>
            <li>Communicate with you regarding your account and courses</li>
            <li>Personalize your learning experience</li>
            <li>Protect the security and safety of our platform</li>
          </ul>
          <h2>3. Information Protection</h2>
          <p>
            We take appropriate security measures to protect your personal
            information from:
          </p>
          <ul>
            <li>Unauthorized access</li>
            <li>Unauthorized modification</li>
            <li>Unauthorized disclosure or destruction</li>
          </ul>
          <h2>4. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties except
            in the following cases:
          </p>
          <ul>
            <li>With your explicit consent</li>
            <li>For legal purposes</li>
            <li>
              With trusted service providers who help us operate our platform
            </li>
          </ul>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct your inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to the processing of your information</li>
          </ul>
        </section>
      )}
    </main>
  );
};

export default PrivacyPolicy;
