/* eslint-disable react/no-unescaped-entities */
// import { Metadata } from "next";
// import { getMetadataReturnAndRefund } from "@/getMetaData";
import { unstable_setRequestLocale } from "next-intl/server";
// export function generateMetadata({
//   params,
// }: {
//   params: { locale: string };
// }): Metadata {
//   return getMetadataReturnAndRefund({
//     params,
//   });
// }

const ReturnAndRefund = ({ params }: { params: { locale: string } }) => {
  unstable_setRequestLocale(params.locale);

  return (
    <main>
      {params.locale === "ar" ? (
        <section className="container py-24 prose ">
          <h1>سياسة الإرجاع والتبديل</h1>
          <h2>1. سياسة استرداد الأموال</h2>
          <p>
            يمكن طلب استرداد الأموال خلال 3 أيام من تاريخ شراء الكورس، بالشروط
            التالية:
          </p>
          <ul>
            <li>ألا يكون الكورس قد تم إكماله بنسبة تتجاوز 15%</li>
            <li>عدم تحميل أي محتوى رقمي متعلق بالكورس</li>
            <li>تقديم سبب واضح لطلب الاسترداد</li>
          </ul>
          <p>
            يتم معالجة طلبات الاسترداد في غضون 2 يوم عمل بعد الموافقة على الطلب،
            ويتم استرداد الأموال عبر وسيلة الدفع الأصلية.
          </p>

          <h2>2. سياسة التبديل</h2>
          <p>
            يمكن تبديل الكورس المشتري بكورس آخر في غضون 3 أيام من تاريخ الشراء،
            إذا:
          </p>
          <ul>
            <li>لم يتم إكمال الكورس الأصلي بنسبة تزيد عن 15%</li>
            <li>
              كان الكورس البديل متاحًا بنفس القيمة أو أعلى (مع دفع الفرق إن
              وُجد)
            </li>
          </ul>

          <h2>3. كيفية تقديم طلب الإرجاع أو التبديل</h2>
          <p>للتقدم بطلب استرداد أو تبديل، يرجى التواصل معنا عبر:</p>
          <ul>
            <li>البريد الإلكتروني: nexgensupprot@gmail.com</li>
            <li>أو من خلال نموذج الدعم المتوفر على موقعنا</li>
          </ul>
          <p>يجب تضمين تفاصيل الطلب (رقم الطلب، اسم المستخدم، سبب الطلب)</p>

          <h2>4. الشروط العامة</h2>
          <ul>
            <li>جميع الطلبات تخضع لمراجعة فريق الدعم</li>
            <li>
              يحتفظ فريقنا بحق قبول أو رفض الطلبات بناءً على الشروط المذكورة
              أعلاه
            </li>
            <li>
              قد يتم طلب تقديم إثباتات إضافية لتوضيح سبب الإرجاع أو التبديل
            </li>
          </ul>

          <h2>5. استثناءات</h2>
          <ul>
            <li>لا يمكن استرداد الأموال أو تبديل الكورسات المجانية</li>
            <li>الكورسات التي تم الحصول عليها عبر خصومات كبيرة</li>
            <li>
              الكورسات المُقدمة عبر شركاء أو منصات خارجية تخضع لسياسات تلك
              الجهات
            </li>
          </ul>
        </section>
      ) : (
        <section className="container py-24 prose ">
          <h1>Refund and Exchange Policy</h1>
          <h2>1. Refund Policy</h2>
          <p>
            A refund can be requested within 3 days of the course purchase date,
            under the following conditions:
          </p>
          <ul>
            <li>The course completion should not exceed 15%</li>
            <li>
              No digital content related to the course has been downloaded
            </li>
            <li>A clear reason for the refund request must be provided</li>
          </ul>
          <p>
            Refund requests are processed within 2 business days after request
            approval, and funds are returned through the original payment
            method.
          </p>{" "}
          <h2>2. Exchange Policy</h2>
          <p>
            A purchased course can be exchanged for another course within 3 days
            of the purchase date, if:
          </p>
          <ul>
            <li>The original course has not been completed beyond 15%</li>
            <li>
              The replacement course is available at the same value or higher
              (with payment of the difference if applicable)
            </li>
          </ul>
          <h2>3. How to Submit a Refund or Exchange Request</h2>
          <p>To submit a refund or exchange request, please contact us via:</p>
          <ul>
            <li>Email: nexgensupprot@gmail.com</li>
            <li>Or through the support form available on our website</li>
          </ul>
          <p>
            Request details must include (order number, username, reason for
            request)
          </p>
          <h2>4. General Terms</h2>
          <ul>
            <li>All requests are subject to review by the support team</li>
            <li>
              Our team reserves the right to accept or reject requests based on
              the conditions mentioned above
            </li>
            <li>
              Additional proof may be required to clarify the reason for refund
              or exchange
            </li>
          </ul>
          <h2>5. Exceptions</h2>
          <ul>
            <li>Free courses are not eligible for refund or exchange</li>
            <li>Courses obtained through significant discounts</li>
            <li>
              Courses provided through partners or external platforms are
              subject to those entities' policies
            </li>
          </ul>
        </section>
      )}
    </main>
  );
};

export default ReturnAndRefund;
