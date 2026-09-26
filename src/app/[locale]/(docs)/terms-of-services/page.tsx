/* eslint-disable react/no-unescaped-entities */
// import { Metadata } from "next";
// import { getMetadataTermsOfServicePage } from "@/getMetaData";

// export function generateMetadata({
//   params,
// }: {
//   params: { locale: string };
// }): Metadata {
//   return getMetadataTermsOfServices({
//     params,
//   });
// }

import { safetyCopy } from "@/lib/safety-contract";
import { Link } from "@/i18n/navigation";

const TermsOfServices = async (props: { params: Promise<{ locale: string }> }) => {
  const params = await props.params;
  

  return (
    <main>
      {params.locale === "ar" ? (
        <section className="container py-24 prose ">
          <h1>الشروط والأحكام</h1>
          <h2>1. قبول الشروط</h2>
          <p>
            من خلال الوصول إلى واستخدام موقع NEXGEN ("الموقع")، فإنك توافق على
            الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى
            الامتناع عن استخدام الموقع.
          </p>

          <h2>2. استخدام الموقع</h2>
          <p>الموقع مخصص للأغراض التعليمية والاستخدام الشخصي فقط</p>
          <p>يجب استخدام الموقع بطريقة قانونية وأخلاقية</p>
          <p>يُحظر:</p>
          <ul>
            <li>أي شكل من أشكال استخراج البيانات أو التنقيب عنها</li>
            <li>تحميل أو نقل الفيروسات أو البرامج الضارة</li>
            <li>أي نشاط يعطل أو يتداخل مع أداء الموقع أو أمنه</li>
          </ul>

          <h2>3. حسابات المستخدمين</h2>
          <ul>
            <li>قد تحتاج إلى إنشاء حساب للوصول إلى بعض الميزات</li>
            <li>أنت مسؤول عن الحفاظ على سرية بيانات حسابك وكلمة المرور</li>
            <li>يجب إخطارنا فوراً بأي استخدام غير مصرح به لحسابك</li>
            <li>
              نحتفظ بالحق في تعليق أو إنهاء حسابك في حالة الاشتباه في أي نشاط
              غير مصرح به
            </li>
          </ul>

          <h2>4. حقوق الملكية الفكرية</h2>
          <ul>
            <li>جميع المحتويات على الموقع هي ملك لـ NEXGEN أو مورديها</li>
            <li>
              يمكنك عرض وتنزيل وطباعة المحتوى للاستخدام الشخصي وغير التجاري فقط
            </li>
            <li>
              يحظر إعادة إنتاج أو توزيع أو تعديل أي محتوى دون إذن كتابي مسبق
            </li>
          </ul>
          <h2>5. قواعد المجتمع في الموقع والتطبيق</h2>
          <p>{safetyCopy.ar.rules}</p><p>{safetyCopy.ar.review}</p>
          <p><Link href="/contact">{safetyCopy.ar.support}</Link></p>
        </section>
      ) : (
        <section className="container py-24 prose ">
          <h1>Terms and Conditions</h1>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using the NEXGEN website ("the Site"), you agree to
            be bound by these terms and conditions. If you do not agree to these
            terms, please refrain from using the Site.
          </p>
          <h2>2. Use of the Site</h2>
          <p>The Site is intended for educational and personal use only</p>
          <p>The Site must be used in a legal and ethical manner</p>
          <p>Prohibited activities:</p>
          <ul>
            <li>Any form of data extraction or mining</li>
            <li>Uploading or transmitting viruses or malicious software</li>
            <li>
              Any activity that disrupts or interferes with the Site's
              performance or security
            </li>
          </ul>

          <h2>3. User Accounts</h2>
          <ul>
            <li>
              You may need to create an account to access certain features
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your
              account details and password
            </li>
            <li>
              You must notify us immediately of any unauthorized use of your
              account
            </li>
            <li>
              We reserve the right to suspend or terminate your account if any
              unauthorized activity is suspected
            </li>
          </ul>

          <h2>4. Intellectual Property Rights</h2>
          <ul>
            <li>
              All content on the Site is the property of NEXGEN or its suppliers
            </li>
            <li>
              You may view, download, and print content for personal and
              non-commercial use only
            </li>
            <li>
              Reproduction, distribution, or modification of any content without
              prior written permission is prohibited
            </li>
          </ul>
          <h2>5. Community conduct on the website and app</h2>
          <p>{safetyCopy.en.rules}</p><p>{safetyCopy.en.review}</p>
          <p><Link href="/contact">{safetyCopy.en.support}</Link></p>
        </section>
      )}
    </main>
  );
};

export default TermsOfServices;
