import type { Post } from "@/lib/blog/types";

// T51 stub — real body wrapped from the approved draft in T61.
export const post: Post = {
  meta: {
    slug: "web-sitesi-hizi-core-web-vitals",
    title: "Web Sitesi Hızı Neden Önemli? (Core Web Vitals)",
    datePublished: "2026-07-12",
    readingTime: 5,
    excerpt:
      "Web sitesi hızı neden önemli? Core Web Vitals (LCP, INP, CLS) sade bir dille, siteyi yavaşlatan yaygın nedenler, ölçüm araçları ve kalıcı hız için ilkeler.",
    targetQuery: "web sitesi hızı",
    serviceAnchor: "web-tasarim-gelistirme",
  },
  body: `Web sitesi hızı, çoğu işletmenin en son düşündüğü ama kullanıcıların ilk fark ettiği şeydir. Bir sayfa açılırken beklemek zorunda kalan ziyaretçi, sitenizin ne kadar özenle tasarlandığını görmeden geri döner. Web sitesi hızı yalnızca bir konfor meselesi değildir; doğrudan dönüşüm oranınızı ve arama motoru sıralamanızı etkileyen, ölçülebilir bir faktördür. Bu yazıda hızın neden bu kadar önemli olduğunu, Google'ın Core Web Vitals metriklerini sade bir dille, siteleri yavaşlatan tipik nedenleri ve kalıcı hız için izlenmesi gereken ilkeleri ele alıyoruz.

## Hız neden dönüşümü ve SEO'yu etkiler?

Hızın etkisi iki koldan gelir ve ikisi de doğrudan işinize dokunur.

Birincisi dönüşümdür. Kullanıcı sabırsızdır; açılması saniyeler süren bir sayfada beklemek yerine geri döner. Bu terk, çoğu zaman siteniz henüz tek bir mesajını iletmeden yaşanır. Yavaş bir site, ne kadar iyi tasarlanmış olursa olsun, ziyaretçisini kaybettiği için satışa dönüşmez.

İkincisi arama sıralamasıdır. Google, sayfa deneyimini ve bunun ölçülebilir karşılığı olan Core Web Vitals metriklerini bir sıralama sinyali olarak kullanır. Yani hız, yalnızca sitenize gelen kullanıcıyı elde tutmakla kalmaz; sitenize kaç kullanıcının geleceğini de etkiler. Hızlı bir site hem daha çok bulunur hem de bulunduğunda daha çok iş getirir.

Bu iki etki birbirini besler. Hızlı bir site daha çok ziyaretçiyi karşılar, karşıladığı ziyaretçiyi daha uzun tutar ve onu daha sık müşteriye dönüştürür. Yavaşlık ise ters yönde çalışan sessiz bir sızıntıdır: ne kadar bütçe ayırıp trafik getirirseniz getirin, o trafiğin bir bölümünü daha sayfa açılmadan kaybedersiniz. Bu yüzden hız, pazarlama harcamasının da geri dönüşünü doğrudan etkileyen bir çarpandır.

## Core Web Vitals (LCP, INP, CLS) nedir?

Core Web Vitals, Google'ın gerçek kullanıcı deneyimini ölçmek için tanımladığı üç temel metriktir. Her biri deneyimin farklı bir yönünü ölçer.

- **LCP (Largest Contentful Paint) — yükleme.** Sayfanın ana içeriğinin ne kadar sürede göründüğünü ölçer. İyi bir değer, 2,5 saniye ve altıdır. Kullanıcının "sayfa açıldı" dediği andır.
- **INP (Interaction to Next Paint) — etkileşim.** Kullanıcı bir düğmeye dokunduğunda ya da bir bağlantıya tıkladığında sitenin ne kadar hızlı yanıt verdiğini ölçer. İyi bir değer, 200 milisaniyenin altındadır. Sitenin "akıcı" hissettiren yönüdür.
- **CLS (Cumulative Layout Shift) — görsel kararlılık.** Sayfa yüklenirken öğelerin beklenmedik biçimde kayıp kaymadığını ölçer. İyi bir değer, 0,1'in altındadır. Yanlışlıkla başka bir yere tıklamanıza yol açan o sinir bozucu kaymaları önler.

Bu üç metrik birlikte, bir sayfanın yalnızca "yüklendi mi" sorusuna değil, "kullanması keyifli mi" sorusuna yanıt verir.

Google bu metriklerin her biri için üç aralık tanımlar: iyi, iyileştirme gerekli ve zayıf. Değerlendirme, tek bir laboratuvar testine değil, sitenizi gerçekten ziyaret eden kullanıcıların büyük çoğunluğunun yaşadığı deneyime bakar. Yani hedef, bir kez hızlı bir sonuç almak değil, gerçek kullanıcıların çoğunluğu için tutarlı biçimde hızlı olmaktır. Tek bir güçlü cihazla alınan iyi bir sonuç, ortalama bir telefonda ve sıradan bir bağlantıda aynı deneyimi vermiyorsa yeterli değildir.

## Siteyi yavaşlatan yaygın nedenler

Yavaşlığın kaynağı çoğu zaman birkaç tanıdık suçluya dayanır:

- **Optimize edilmemiş görseller.** Gereğinden büyük fotoğraflar, bir sayfanın en ağır yüküdür ve genellikle en kolay çözülen sorundur.
- **Gereksiz üçüncü taraf kodları.** Her eklenen izleme kodu, sohbet balonu ya da widget, sayfaya ek bir yük bindirir.
- **Ağır altyapı ve eklenti yığınları.** Her ihtiyaç için ayrı bir eklenti kuran siteler, zamanla taşıyamayacağı bir yük biriktirir.
- **Font yükleme sorunları.** Yanlış kurulan yazı tipleri, metnin geç görünmesine ya da yüklenirken kaymasına yol açar.
- **Yavaş barındırma.** Sunucu geç yanıt veriyorsa, ön taraftaki hiçbir iyileştirme bunu tam telafi edemez.

Dikkat çeken nokta şudur: bu nedenlerin çoğu, tasarımın "güzelliğiyle" değil, kurulum disipliniyle ilgilidir. Aynı görsel, doğru boyutlandırıldığında sayfayı yavaşlatmaz; yanlış kullanıldığında en büyük yükü oluşturur. Yani hız, tasarımdan ödün vermek değil, tasarımı doğru inşa etmektir. İyi haber şu: bu nedenlerin çoğu ölçülebilir ve giderilebilir. Sorunu görmek, çözmenin ilk adımıdır.

## Ölçüm araçları

Hızı tahmin etmek yerine ölçmek gerekir. İki tür veri vardır ve ikisine de bakmak önemlidir.

**Laboratuvar verisi**, kontrollü koşullarda yapılan testtir. Lighthouse ve PageSpeed Insights bu tür ölçümü sunar; bir sorunu teşhis etmek ve iyileştirmeyi denemek için idealdir.

**Saha verisi**, sitenizi gerçekten ziyaret eden kullanıcılardan toplanan gerçek deneyim verisidir. Google Search Console'daki Core Web Vitals raporu ve Chrome kullanıcı deneyimi verisi bunu gösterir. Laboratuvarda mükemmel görünen bir site, gerçek cihazlarda ve gerçek bağlantılarda farklı sonuç verebilir; bu yüzden asıl güvenilecek veri sahadan gelendir.

Raporları okurken tek bir puana takılıp kalmamak önemlidir. Yüz üzerinden verilen skor faydalı bir özettir, ama asıl değerli olan, hangi metriğin neden düşük olduğunu gösteren ayrıntıdır. İyileştirme, puanı değil, o puanın altındaki gerçek sorunu hedeflemelidir; aksi halde skoru birkaç puan yükseltip kullanıcı deneyimini olduğu yerde bırakmak mümkündür.

## Kalıcı hız için ilkeler

Hız, bir kez yapılıp bitirilen bir iş değildir. Zamanla eklenen her görsel, her yeni kod ve her yeni özellik siteyi yeniden yavaşlatabilir. Kalıcı hız, birkaç ilkeye bağlıdır:

- Performansı en baştan bir **bütçe** olarak belirleyin: sayfanın taşıyabileceği bir üst sınır koyun ve o sınırı koruyun.
- Görselleri doğru boyutlandırın ve modern biçimlerde sunun.
- Üçüncü taraf kodlarını gerçekten gerekenlerle sınırlayın.
- Yazı tiplerini kendi sunucunuzdan, doğru şekilde yükleyin.
- Hızı düzenli olarak ölçün; tek seferlik değil, süregelen bir alışkanlık haline getirin.

Bu ilkelerin ortak noktası şudur: hız, birinin son anda uğraşacağı bir düzeltme değil, ekibin baştan benimsediği bir alışkanlıktır. Performans bütçesi olan bir projede her yeni özellik "bu, bütçeyi aşar mı?" sorusuyla değerlendirilir; böylece site zamanla yavaşlamak yerine hızını korur. Sonradan hızlandırmaya çalışmak, baştan hızlı kurmaktan her zaman daha zordur.

Biz DMRC olarak siteleri bu disiplinle kuruyoruz; performans, sonradan eklenen bir iyileştirme değil, ilk günden konulan bir hedeftir. Okumakta olduğunuz bu sitenin kendisi de aynı performans bütçesiyle geliştirildi. Hızlı, aranınca bulunan ve ziyaretçisini elde tutan bir kurumsal site kurmak isterseniz [web tasarım ve geliştirme hizmetimizi](/hizmetler#web-tasarim-gelistirme) inceleyebilir ya da projenizi anlatıp [teklif alabilirsiniz](/iletisim). Her mesaja 48 saat içinde yazılı olarak yanıt veriyoruz.`,
};
