import type { Post } from "@/lib/blog/types";

// T51 stub — real body wrapped from the approved draft in T59.
export const post: Post = {
  meta: {
    slug: "mobil-uygulama-yaptirma-sureci",
    title: "Mobil Uygulama Yaptırma Süreci ve Maliyet Kalemleri",
    datePublished: "2026-07-12",
    readingTime: 5,
    excerpt:
      "Mobil uygulama yaptırma süreci: fikirden mağazaya adımlar, tek kod tabanının (Expo) avantajı, maliyet kalemleri ve OTA güncellemenin neden önemli olduğu.",
    targetQuery: "mobil uygulama yaptırma",
    serviceAnchor: "mobil-uygulama",
  },
  body: `Bir mobil uygulama yaptırma kararı çoğu zaman tek bir cümleyle başlar: "Keşke müşterilerimiz bunu telefonlarından yapabilse." Bu fikirden mağazada indirilebilir bir uygulamaya giden yol ise birkaç net adımdan oluşur. Bu yazıda mobil uygulama yaptırma sürecini baştan sona anlatıyor; iOS ve Android'i tek kod tabanından yürütmenin ne kazandırdığını, maliyeti oluşturan kalemleri ve lansman sonrası bakımın neden kritik olduğunu ele alıyoruz. Anlatırken kendi uygulamamız [VAAZ](/isler/vaaz)'dan örnekler veriyoruz; çünkü bu süreci yalnızca müşterilerimiz için değil, kendi ürünlerimiz için de uçtan uca yürütüyoruz.

## Fikirden mağazaya: süreç adımları

İyi yürütülen bir uygulama projesi belirli aşamalardan geçer. Bu adımları atlamak değil, sıralı ve disiplinli işletmek işi kısaltan şeydir.

1. **Keşif ve kapsam.** Uygulamanın gerçekten çözdüğü sorunu, hedef kullanıcıyı ve ilk sürümde yer alacak temel işlevleri netleştiririz. Her fikir birinci sürüme sığmaz; doğru olanı seçmek en değerli karardır.
2. **Tasarım.** Önce kullanıcı akışları, sonra arayüz. Kullanıcının bir işi kaç dokunuşta bitirdiği, uygulamanın başarısını doğrudan belirler.
3. **Geliştirme.** Tasarım, çalışan bir ürüne dönüşür. Haftalık sürüm ritmiyle ilerlemek, gidişatı erken görmeyi sağlar.
4. **Test.** Gerçek cihazlarda, farklı ekran boyutlarında ve zayıf bağlantı koşullarında denenir. Mağazaya çıkmadan önce yakalanan bir hata, çıktıktan sonra giderilenden çok daha az maliyetle çözülür.
5. **Mağaza süreçleri ve yayın.** App Store ve Google Play inceleme süreçleri, mağaza kayıtları ve yayın hazırlığı tamamlanır.
6. **Bakım ve güncelleme.** Yayın, sürecin sonu değil; asıl yaşam döngüsünün başlangıcıdır.

Bu adımlar tümüyle sıralı değildir; tasarım ile geliştirme çoğu zaman iç içe ilerler ve test, sürecin her aşamasına yayılır. Önemli olan, her adımın kendi kararını zamanında vermesidir. En pahalı hatalar geç fark edilen kapsam belirsizliklerinden doğar; bu yüzden ilk aşamada "ne yapmayacağımıza" karar vermek, en az "ne yapacağımıza" karar vermek kadar değerlidir.

## iOS + Android tek kod tabanı (Expo) ne kazandırır?

Bir uygulamayı iOS ve Android için ayrı ayrı, iki farklı dilde geliştirmek uzun yıllar tek yoldu. Bugün ise tek bir kod tabanından her iki platforma birden çıkmak mümkün. Biz uygulamalarımızı **Expo** tabanında geliştiriyoruz; VAAZ da bu şekilde hem iOS hem Android'de, iki mağazada da **4,9** puanla canlı.

Tek kod tabanının kazandırdıkları somuttur:

- **Maliyet ve süre.** İki ayrı ekip yerine tek ekip, tek kod tabanı; aynı işi iki kez yapmazsınız.
- **Tutarlılık.** Bir özellik her iki platformda aynı anda ve aynı davranışla yayınlanır.
- **Bakım kolaylığı.** Düzeltmeler ve yeni özellikler tek yerde geliştirilir, her iki mağazaya birlikte ulaşır.

Bu yaklaşım, çoğu iş uygulaması için hem hızlı hem de sürdürülebilir olanıdır. Yoğun grafik ya da platforma özel derin donanım erişimi gerektiren istisnai durumlar dışında, işletmelerin büyük bölümü için doğru tercihtir.

Sık sorulan bir soru şudur: tek kod tabanı, uygulamanın "yerel" hissini zayıflatır mı? Doğru kurulduğunda hayır. Modern araçlar, her iki platformun kendi tasarım beklentilerine uyan, akıcı ve hızlı arayüzler üretmeye elverir. Sonuçta kullanıcı, uygulamanın hangi teknolojiyle yazıldığını değil, ne kadar iyi çalıştığını görür; VAAZ'ın mağaza puanı da bunun bir kanıtıdır.

## Maliyet kalemleri

Bir uygulamanın maliyetini oluşturan kalemleri dört başlıkta toplamak mümkündür. Sabit bir rakam yerine bu kalemleri anlamak, bütçenizi çok daha sağlıklı planlamanızı sağlar.

### Tasarım

Kullanıcı akışlarının kurgulanması ve arayüzün tasarlanması. Uygulamanın kaç ekrandan oluştuğu ve etkileşimlerin karmaşıklığı bu kalemi belirler.

### Geliştirme

En büyük kalem genellikle budur: işlevlerin hayata geçirilmesi, arka uç ile bağlantı, testler. Özellik sayısı ve entegrasyonlar arttıkça geliştirme emeği de artar.

### Mağaza süreçleri

Apple ve Google geliştirici hesapları (yıllık ya da tek seferlik ücretleriyle), mağaza kayıtlarının hazırlanması ve inceleme süreçlerinin yürütülmesi. Görece küçük ama atlanmaması gereken bir kalemdir.

### Bakım

Uygulama yayınlandıktan sonra da yaşar: işletim sistemi güncellemelerine uyum, hata düzeltmeleri, yeni özellikler ve sunucu giderleri. Bakımı baştan planlamak, uygulamanızın zamanla değer kaybetmesini önler.

Bu dört kalem birbirinden bağımsız değildir. Kapsamı büyüttükçe tasarım, geliştirme ve bakım yükü birlikte artar; küçük ve odaklı bir ilk sürüm ise her üç kalemi de makul tutar. Bu yüzden maliyeti konuşurken tek bir rakam yerine, uygulamanın yaşam döngüsünün tamamını görmek daha sağlıklıdır.

## OTA güncelleme neden önemli?

Klasik yöntemde uygulamada yaptığınız her değişiklik, mağaza inceleme sürecinden geçmek zorundadır; bu da küçük bir düzeltme için bile gün kaybı demektir. **OTA (over-the-air) güncelleme** ise pek çok değişikliği, kullanıcı uygulamayı bir daha güncellemek zorunda kalmadan doğrudan iletmenizi sağlar.

Bunun pratik faydası büyüktür: bir metni düzeltmek, bir hatayı gidermek ya da küçük bir iyileştirme yayınlamak dakikalar sürer. VAAZ'da güncellemeleri OTA ve mağaza kanallarını birlikte kullanarak dağıtıyoruz; böylece kullanıcılar en güncel sürümü hızla alıyor. OTA her şeyi çözmez — bazı köklü değişiklikler yine mağaza incelemesi ister — ama günlük iyileştirme temposunu belirgin biçimde hızlandırır.

Bu esneklik, özellikle lansman sonrası ilk haftalarda değerlidir. Gerçek kullanıcılar uygulamayı kullanmaya başladığında, küçük ama önemli iyileştirme ihtiyaçları hızla ortaya çıkar; bir düğmenin yeri, bir metnin anlaşılırlığı, bir akıştaki takılma. OTA sayesinde bu düzeltmeleri günlerce süren mağaza döngülerini beklemeden kullanıcıya ulaştırabilir, uygulamanın ilk izlenimini erkenden güçlendirebilirsiniz.

## Uygulamanızı nasıl planlamalısınız?

En sık gördüğümüz hata, ilk sürüme her şeyi sığdırmaya çalışmaktır. Daha sağlıklı yol, önce çekirdek değeri sunan yalın bir sürüm yayınlamak, gerçek kullanıcıların davranışını görmek ve sonrasını bu geri bildirime göre kurmaktır. Uygulama, kâğıt üzerindeki en uzun özellik listesiyle değil, insanların gerçekten kullandığı birkaç işlevi kusursuz yapmakla kazanır.

Bu yaklaşımın adı yaygın olarak "minimum uygulanabilir ürün"dür: piyasaya, öğrenmenizi sağlayacak en küçük anlamlı sürümle çıkmak. Bu, hedeflerinizi küçültmek değil, doğru sırayla büyütmektir. İlk sürümden alınan gerçek kullanım verileri, sonraki yatırımlarınızı tahmine değil kanıta dayandırmanızı sağlar; hangi özelliğin gerçekten işe yaradığını, kullanıcı size gösterir. Böylece bütçenizi en çok değer üreten yöne akıtır, denenmemiş varsayımlara harcamazsınız.

Biz DMRC olarak mobil uygulamaları, kendi ürünlerimizi kurduğumuz aynı disiplinle geliştiriyoruz: tek kod tabanı, haftalık sürüm ritmi, mağaza süreçleri ve OTA güncelleme hattı. Fikrinizi mağazaya taşımayı konuşmak isterseniz [mobil uygulama hizmetimizi](/hizmetler#mobil-uygulama) inceleyebilir ya da projenizi kısaca anlatıp [teklif alabilirsiniz](/iletisim). Her mesajı okuyor, 48 saat içinde yazılı olarak yanıtlıyoruz.`,
};
