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
      <section id="account-deletion" className="container pb-24 prose">
        <h2>{params.locale === "ar" ? "حذف الحساب والاحتفاظ بالبيانات" : "Account deletion and data retention"}</h2>
        <p>{params.locale === "ar"
          ? "يمكنك طلب حذف حساب نكس جين والبيانات الشخصية المرتبطة به بعد التحقق من ملكية البريد الإلكتروني. تقديم الطلب لا يعني اكتمال الحذف، ويمكن إلغاؤه قبل بدء المعالجة. نزّل الشهادات التي تريد الاحتفاظ بها قبل الحذف."
          : "You can request deletion of your NexGen account and associated personal data after verifying ownership of your email address. A request is not completed deletion, and you can cancel before processing starts. Download any certificates you want to keep before deletion."}</p>
        <p>{params.locale === "ar"
          ? "توضح صفحة طلب الحذف تفاصيل المعالجة والاحتفاظ المعتمدة عند توفرها. قد تُحتفظ بالسجلات المالية المطلوبة قانونيًا بصورة مقيدة لمدة محددة. تخضع النسخ الاحتياطية لدورة احتفاظ معلنة، ويجب ألا تعيد عمليات الاستعادة الحسابات المحذوفة."
          : "The deletion request page displays the approved processing and retention details when available. Legally required financial records may be retained with restricted access for a defined period. Backups follow the disclosed retention schedule, and restores must not resurrect deleted accounts."}</p>
        <a href={"/" + params.locale + "/account-deletion"}>{params.locale === "ar" ? "طلب حذف الحساب أو متابعة الطلب" : "Request account deletion or manage your request"}</a>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
