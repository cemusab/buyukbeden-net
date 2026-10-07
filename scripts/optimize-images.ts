/**
 * Stok fotoğraf boru hattı (Pexels + Unsplash).
 *
 * Kaynak liste: docs/gorsel-adaylari.md (aday numaraları `n` ile eşleşir).
 * Kabul edilen her görsel için:
 *   1. Ham dosya `.cache/images-raw/{n}.jpg` yoksa listedeki w=2000 URL'den indirilir
 *      (yalnız images.pexels.com / images.unsplash.com).
 *   2. Gerekirse kırpılır, görünür marka logosu/etiketi rötuşlanır (bkz. `retouch`).
 *   3. public/images/stok/{slot}/{source}-{id}.{avif,webp,jpg} üretilir.
 *   4. docs/gorsel-manifest.md yeniden yazılır.
 *
 * Çalıştırma: npx tsx scripts/optimize-images.ts   (tekrar çalıştırılabilir)
 *   ONLY=29,57 npx tsx scripts/optimize-images.ts  → yalnız bu adaylar (manifest yazılmaz)
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(__dirname, "..");
const RAW_DIR = path.join(ROOT, ".cache/images-raw");
const OUT_DIR = path.join(ROOT, "public/images/stok");
const MANIFEST = path.join(ROOT, "docs/gorsel-manifest.md");
const ALLOWED_HOSTS = new Set(["images.pexels.com", "images.unsplash.com"]);
const CHECKED_AT = "2026-10-07";

type Box = { x: number; y: number; w: number; h: number };
/** copy: (dx,dy) kaydırılmış komşu bölge yumuşak kenarla kopyalanır; interp: her satır sol/sağ kenar renkleri arasında, vinterp: her sütun üst/alt kenar renkleri arasında doğrusal doldurulur. */
type Retouch = Box & { dx: number; dy: number; note: string; mode?: "copy" | "interp" | "vinterp" };

type Item = {
  n: number;
  source: "pexels" | "unsplash";
  id: string;
  slot: string;
  url: string;
  page: string;
  name: string;
  profile: string;
  alt: string;
  /** Kırpma (ham 2000 px genişlikli görselin pikselleri). */
  crop?: Box;
  /** Logo/etiket rötuşu: (x,y,w,h) bölgesi, (dx,dy) kaydırılmış komşu kumaşla örtülür. */
  retouch?: Retouch[];
  /** Çıktı en fazla genişlik (px). Varsayılan: yatay 1600, dikey 1200. */
  maxW?: number;
  /** Ek kullanım notu (aynı dosya başka slotta da kullanılabilir). */
  also?: string;
};

const px = (id: string) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2000`;
const us = (photo: string) => `https://images.unsplash.com/photo-${photo}?fm=jpg&q=80&w=2000&fit=max`;

const ITEMS: Item[] = [
  // Hero
  { n: 1, source: "pexels", id: "7535475", slot: "hero-kadin", url: px("7535475"), page: "https://www.pexels.com/photo/a-smiling-woman-wearing-a-white-shirt-7535475/", name: "Los Muertos Crew", profile: "https://www.pexels.com/@cristian-rojas/", alt: "Parkta beyaz tişört ve açık mavi jean giymiş, gülümseyen kadın", maxW: 2000 },
  { n: 2, source: "pexels", id: "7535450", slot: "hero-kadin", url: px("7535450"), page: "https://www.pexels.com/photo/7535450/", name: "Los Muertos Crew", profile: "https://www.pexels.com/@cristian-rojas/", alt: "Yeşillikler arasında beyaz tişört ve jean giymiş, elini saçına götüren gülümseyen kadın", maxW: 2000 },
  { n: 3, source: "pexels", id: "7240263", slot: "kadin-sweatshirt", url: px("7240263"), page: "https://www.pexels.com/photo/smiling-woman-in-hoodie-sitting-on-wooden-chair-7240263/", name: "RDNE Stock project", profile: "https://www.pexels.com/@rdne/", alt: "Pencere önünde ahşap taburede oturan, lila kapüşonlu sweatshirt giymiş gülen kadın", maxW: 2000, also: "hero-kadin alternatifi" },
  { n: 5, source: "unsplash", id: "LpjpApXzB3M", slot: "hero-erkek", url: us("1573878415613-fe2a3f769cab"), page: "https://unsplash.com/photos/LpjpApXzB3M", name: "AllGo - An App For Plus Size People", profile: "https://unsplash.com/@canweallgo", alt: "Aydınlık bir ortak çalışma alanında yeşil polo yaka tişört giymiş, gözlüklü, gülümseyen adam", maxW: 2000, also: "erkek-polo" },
  // Kadın
  { n: 6, source: "pexels", id: "25630878", slot: "kadin-elbise", url: px("25630878"), page: "https://www.pexels.com/photo/model-in-patterned-green-dress-25630878/", name: "Ruchira Nangalia", profile: "https://www.pexels.com/@ruchira-nangalia-1348013095/", alt: "Aydınlık salonda desenli yeşil, V yaka diz üstü elbise ve beyaz spor ayakkabı giymiş kadın, tam boy", also: "genel-tam-boy-kadin" },
  { n: 7, source: "pexels", id: "4689903", slot: "kadin-elbise", url: px("4689903"), page: "https://www.pexels.com/photo/a-woman-in-maroon-dress-standing-and-posing-4689903/", name: "Konstantin Mishchenko", profile: "https://www.pexels.com/@aksioart/", alt: "Kahverengi stüdyo fonunda uzun kollu, diz boyu bordo elbise giymiş kadın" },
  { n: 8, source: "unsplash", id: "m3peW4Kq6oc", slot: "kadin-elbise", url: us("1573878742615-3ce8fac77273"), page: "https://unsplash.com/photos/m3peW4Kq6oc", name: "AllGo - An App For Plus Size People", profile: "https://unsplash.com/@canweallgo", alt: "Ofis ortamında bordo kruvaze, truvakar kollu elbise giymiş gözlüklü kadın", also: "genel-tam-boy-kadin" },
  { n: 11, source: "pexels", id: "7535437", slot: "kadin-jean", url: px("7535437"), page: "https://www.pexels.com/photo/a-woman-holding-a-bouquet-of-flowers-7535437/", name: "Los Muertos Crew", profile: "https://www.pexels.com/@cristian-rojas/", alt: "Parkta elinde çiçek buketiyle yürüyen, beyaz tişört ve açık mavi skinny jean giymiş kadın" },
  { n: 13, source: "unsplash", id: "A20aMVzsYkU", slot: "kadin-jean", url: us("1619799131019-172979a4c266"), page: "https://unsplash.com/photos/A20aMVzsYkU", name: "Jade Destiny", profile: "https://unsplash.com/@iamjadedestiny", alt: "Ahşap verandanın basamaklarında oturan, siyah tişört ve yırtık jean giymiş, şapkasını havaya atan gülen kadın" },
  { n: 12, source: "pexels", id: "9164765", slot: "kadin-tisort", url: px("9164765"), page: "https://www.pexels.com/photo/a-woman-in-white-crew-neck-t-shirt-and-blue-denim-jeans-9164765/", name: "Darina Belonogova", profile: "https://www.pexels.com/@darina-belonogova/", alt: "Açık gri fonda beyaz bisiklet yaka tişört, siyah kemer ve yüksek bel açık mavi jean giymiş kadın", also: "kadin-jean" },
  { n: 14, source: "pexels", id: "6975619", slot: "kadin-triko", url: px("6975619"), page: "https://www.pexels.com/photo/cheerful-plump-woman-winking-at-camera-6975619/", name: "SHVETS production", profile: "https://www.pexels.com/@shvets-production/", alt: "Beyaz fonda pastel renk çizgili örgü kazak giymiş, göz kırpan kadın" },
  { n: 16, source: "unsplash", id: "ixQ_d82n41A", slot: "kadin-hirka", url: us("1594864847339-d4bb38e91d62"), page: "https://unsplash.com/photos/ixQ_d82n41A", name: "tabitha turner", profile: "https://unsplash.com/@tabithaturnervisuals", alt: "Orman yolunda kiremit rengi tulumun üzerine uzun desenli kimono hırka ve bot giymiş kadın", also: "genel-tam-boy-kadin" },
  { n: 17, source: "pexels", id: "9164742", slot: "kadin-gomlek", url: px("9164742"), page: "https://www.pexels.com/photo/woman-in-purple-long-sleeves-sitting-on-a-chair-9164742/", name: "Darina Belonogova", profile: "https://www.pexels.com/@darina-belonogova/", alt: "Sandalyede oturan, beyaz tişört ve jean üzerine lila oversize gömlek giymiş kadın" },
  { n: 18, source: "pexels", id: "15502167", slot: "kadin-abiye", url: px("15502167"), page: "https://www.pexels.com/photo/plus-size-model-in-elegant-dress-15502167/", name: "Teodora Popa", profile: "https://www.pexels.com/@teodorapopa/", alt: "Gün batımı ışığında ormanda omzu açık, taş kemerli petrol mavisi abiye elbise giymiş kadın" },
  { n: 19, source: "pexels", id: "12780763", slot: "kadin-abiye", url: px("12780763"), page: "https://www.pexels.com/photo/woman-wearing-a-shiny-black-dress-12780763/", name: "Hillary Disantos", profile: "https://www.pexels.com/@hillary-disantos-1557063/", alt: "Bahçede payetli siyah, volanlı etekli abiye elbise giymiş gülümseyen kadın" },
  { n: 22, source: "unsplash", id: "ZAbdSzJnFtQ", slot: "kadin-etek", url: us("1573878591960-37c788c55728"), page: "https://unsplash.com/photos/ZAbdSzJnFtQ", name: "AllGo - An App For Plus Size People", profile: "https://unsplash.com/@canweallgo", alt: "Büyük pencerelerin önünde krem balıkçı yaka üst ve kiremit-bej asimetrik pliseli midi etek giymiş kadın, tam boy", also: "genel-tam-boy-kadin" },
  { n: 23, source: "pexels", id: "7388874", slot: "kadin-ceket", url: px("7388874"), page: "https://www.pexels.com/photo/diverse-friends-leaning-on-wall-7388874/", name: "John Diez", profile: "https://www.pexels.com/@john-diez/", alt: "Duvara yaslanmış, bej gömlek ceket, ekose gömlek, jean ve beyaz spor ayakkabı giymiş pembe saçlı kadın", crop: { x: 900, y: 800, w: 1100, h: 2150 }, also: "genel-tam-boy-kadin (kırpılmış; yandaki kişi çıkarıldı)" },
  { n: 24, source: "pexels", id: "17153115", slot: "kadin-kaban", url: px("17153115"), page: "https://www.pexels.com/photo/model-in-a-beige-coat-striped-blouse-and-navy-blue-pants-17153115/", name: "Centre for Ageing Better", profile: "https://www.pexels.com/@centre-for-ageing-better-55954677/", alt: "Açık fonda bej uzun trençkot, çizgili gömlek ve lacivert pantolon giymiş, pembe çanta taşıyan kadın" },
  { n: 25, source: "pexels", id: "17086214", slot: "kadin-tesettur", url: px("17086214"), page: "https://www.pexels.com/photo/woman-in-a-checkered-dress-and-red-headscarf-17086214/", name: "SAAD EMRIS", profile: "https://www.pexels.com/@emris/", alt: "Beyaz badanalı sokakta ahşap kapı önünde kırmızı başörtüsü ve kazayağı desenli uzun elbise giymiş kadın", also: "genel-tam-boy-kadin" },
  // Erkek
  { n: 26, source: "pexels", id: "17756848", slot: "erkek-tisort", url: px("17756848"), page: "https://www.pexels.com/photo/man-leaning-on-a-wall-17756848/", name: "Murat IŞIK", profile: "https://www.pexels.com/@bymuratisikofficial/", alt: "Taş sütuna yaslanmış, krem tişört ve bej şort giymiş sakallı adam", also: "genel-tam-boy-erkek" },
  { n: 28, source: "pexels", id: "19456413", slot: "erkek-gomlek", url: px("19456413"), page: "https://www.pexels.com/photo/studio-shot-of-a-bearded-man-in-a-shirt-standing-and-a-smiling-19456413/", name: "Jonathan Borba", profile: "https://www.pexels.com/@jonathanborba/", alt: "Bej fonda hakim yaka kısa kollu beyaz gömlek ve ekose pantolon giymiş, gülen sakallı adam" },
  { n: 29, source: "unsplash", id: "J-vLwmivhww", slot: "erkek-gomlek", url: us("1739407106329-0ca850795bc7"), page: "https://unsplash.com/photos/J-vLwmivhww", name: "Romello Morris", profile: "https://unsplash.com/@imverymello", alt: "Kırmızı fonda açık mavi uzun kollu gömlek giymiş sakallı adam", retouch: [{ x: 1452, y: 1066, w: 76, h: 100, dx: -95, dy: 0, note: "göğüsteki marka nakışı komşu kumaşla örtüldü" }] },
  { n: 31, source: "unsplash", id: "VXHnkrf_9lU", slot: "erkek-pantolon", url: us("1739407107136-0bdf53f2e798"), page: "https://unsplash.com/photos/VXHnkrf_9lU", name: "Romello Morris", profile: "https://unsplash.com/@imverymello", alt: "Kırmızı fonda açık mavi gömlek, koyu kahve pantolon ve bordo bot giymiş, yürür pozda gülen adam, tam boy", retouch: [{ x: 1274, y: 664, w: 36, h: 46, dx: -50, dy: 0, note: "göğüsteki marka nakışı komşu kumaşla örtüldü" }], also: "genel-tam-boy-erkek" },
  { n: 32, source: "pexels", id: "4728882", slot: "erkek-gomlek", url: px("4728882"), page: "https://www.pexels.com/photo/man-in-blue-button-up-shirt-holding-a-glass-of-drink-4728882/", name: "Artem Podrez", profile: "https://www.pexels.com/@artempodrez/", alt: "Eski tuğla duvar önünde beyaz tişört üzerine desenli kot gömlek giymiş, elinde bardak tutan sakallı adam" },
  { n: 35, source: "unsplash", id: "Ld9fQtZl_pc", slot: "erkek-gomlek", url: us("1573879541250-58ae8b322b40"), page: "https://unsplash.com/photos/Ld9fQtZl_pc", name: "AllGo - An App For Plus Size People", profile: "https://unsplash.com/@canweallgo", alt: "Beyaz koridorda duvara yaslanmış, koyu ekose gömlek ve jean giymiş sakallı adam" },
  { n: 36, source: "pexels", id: "16962363", slot: "erkek-polo", url: px("16962363"), page: "https://www.pexels.com/photo/man-in-a-white-polo-shirt-16962363/", name: "Carmel Nsenga", profile: "https://www.pexels.com/@carmel-nsenga-735492/", alt: "Açık gri fonda krem polo yaka tişört ve bej pantolon giymiş, elleri cebinde gülen sakallı adam", retouch: [{ x: 1290, y: 1046, w: 62, h: 82, dx: 0, dy: 130, note: "göğüsteki marka nakışı komşu kumaşla örtüldü" }], also: "genel-tam-boy-erkek" },
  { n: 38, source: "pexels", id: "20036211", slot: "erkek-triko", url: px("20036211"), page: "https://www.pexels.com/photo/portrait-of-man-in-pullover-20036211/", name: "Rahib Hamidov", profile: "https://www.pexels.com/@hamidoffstudio/", alt: "Liman arka planında siyah triko kazak giymiş, elleri cebinde sakallı adam", also: "erkek-sweatshirt (yedek)" },
  { n: 39, source: "pexels", id: "10802716", slot: "erkek-mont", url: px("10802716"), page: "https://www.pexels.com/photo/stylish-man-in-black-bubble-jacket-10802716/", name: "Ehab Khalaf Photography", profile: "https://www.pexels.com/@ehabkhalafphotography/", alt: "Kemerli kapı önünde siyah şişme mont, beyaz pantolon ve beyaz spor ayakkabı giymiş sakallı adam, tam boy", also: "genel-tam-boy-erkek" },
  // Beden rehberi kapakları
  { n: 42, source: "pexels", id: "6766234", slot: "kapak-beden-rehberi-erkek", url: px("6766234"), page: "https://www.pexels.com/photo/tailor-measuring-a-client-s-chest-6766234/", name: "Tima Miroshnichenko", profile: "https://www.pexels.com/@tima-miroshnichenko/", alt: "Terzi atölyesinde bir terzinin müşterinin kol ve göğüs ölçüsünü mezurayla alması" },
  { n: 43, source: "pexels", id: "6461399", slot: "kapak-beden-rehberi", url: px("6461399"), page: "https://www.pexels.com/photo/a-measuring-tape-with-centimeter-details-6461399/", name: "Pavel Danilyuk", profile: "https://www.pexels.com/@pavel-danilyuk/", alt: "Siyah kumaş önünde sarkan, santim işaretli sarı terzi mezurası" },
  { n: 45, source: "pexels", id: "4622403", slot: "kapak-beden-rehberi-kadin", url: px("4622403"), page: "https://www.pexels.com/photo/person-in-gray-and-black-striped-long-sleeve-shirt-4622403/", name: "cottonbro studio", profile: "https://www.pexels.com/@cottonbro/", alt: "Moda atölyesinde boynuna terzi mezurası asmış, haki örgü tişörtlü kişi; yüz kadraj dışında" },
  // Kumaşlar
  { n: 46, source: "pexels", id: "7794365", slot: "kumas-keten", url: px("7794365"), page: "https://www.pexels.com/photo/close-up-of-a-linen-texture-7794365/", name: "Monstera Production", profile: "https://www.pexels.com/@gabby-k/", alt: "Doğal bej keten görünümlü kumaş dokusu, yakın plan" },
  { n: 47, source: "pexels", id: "7232409", slot: "kumas-keten", url: px("7232409"), page: "https://www.pexels.com/photo/close-up-shot-of-a-beige-textile-7232409/", name: "Artem Podrez", profile: "https://www.pexels.com/@artempodrez/", alt: "Hafif kırışık bej dokuma kumaşın dokusu ve kıvrımları" },
  { n: 48, source: "pexels", id: "7232397", slot: "kumas-pamuk", url: px("7232397"), page: "https://www.pexels.com/photo/close-up-white-fabric-with-crumple-7232397/", name: "Artem Podrez", profile: "https://www.pexels.com/@artempodrez/", alt: "Buruşmuş açık bej dokuma kumaş, yakın plan" },
  { n: 49, source: "pexels", id: "4049757", slot: "kumas-denim", url: px("4049757"), page: "https://www.pexels.com/photo/close-up-of-denim-fabric-4049757/", name: "Dan Cristian Pădureț", profile: "https://www.pexels.com/@paduret/", alt: "Açık mavi denim kumaşın çapraz dokusu, yakın plan" },
  { n: 50, source: "pexels", id: "10133275", slot: "kumas-denim", url: px("10133275"), page: "https://www.pexels.com/photo/denim-textile-in-stacks-10133275/", name: "Viktorya Sergeeva", profile: "https://www.pexels.com/@johndetochka/", alt: "Farklı mavi tonlarında üst üste katlanmış denim kumaşlar" },
  { n: 51, source: "pexels", id: "6757412", slot: "kumas-orgu", url: px("6757412"), page: "https://www.pexels.com/photo/close-up-of-a-sweater-fabric-6757412/", name: "Karola G (Kaboompics)", profile: "https://www.pexels.com/@karola-g/", alt: "Bej saç örgü desenli triko kazak dokusu, yakın plan" },
  { n: 52, source: "pexels", id: "5807038", slot: "kumas-orgu", url: px("5807038"), page: "https://www.pexels.com/photo/knitted-fabric-5807038/", name: "Ksenia Chernaya", profile: "https://www.pexels.com/@kseniachernaya/", alt: "Açık gri-mavi örgü triko kumaş dokusu, yakın plan" },
  { n: 55, source: "pexels", id: "14367613", slot: "kumas-orgu", url: px("14367613"), page: "https://www.pexels.com/photo/stack-of-sweaters-14367613/", name: "Aliaksei Semirski", profile: "https://www.pexels.com/@asemirski/", alt: "Gri, mavi ve krem tonlarında üst üste katlanmış örgü kazaklar" },
  { n: 53, source: "pexels", id: "35993328", slot: "kumas-viskon", url: px("35993328"), page: "https://www.pexels.com/photo/smooth-beige-silk-fabric-with-elegant-folds-35993328/", name: "Nati", profile: "https://www.pexels.com/@nati-87264186/", alt: "Akışkan, parlak bej kumaşın yumuşak dökümlü kıvrımları" },
  { n: 54, source: "pexels", id: "7717488", slot: "kumas-viskon", url: px("7717488"), page: "https://www.pexels.com/photo/white-soft-satin-fabric-7717488/", name: "Marina Leonova", profile: "https://www.pexels.com/@marina-zasorina/", alt: "Kırık beyaz saten görünümlü kumaşın yumuşak kıvrımları", also: "kumas-saten" },
  // Stil, kombin, alışveriş, markalar
  { n: 56, source: "pexels", id: "4982854", slot: "kapak-stil", url: px("4982854"), page: "https://www.pexels.com/photo/woman-standing-on-top-of-the-stairs-4982854/", name: "Gustavo Araújo", profile: "https://www.pexels.com/@gustavoajfotografia/", alt: "Beyaz-mavi tarihi bir binanın turkuaz kapısı önünde, merdiven başında çizgili elbiseli kadın" },
  { n: 57, source: "pexels", id: "14577586", slot: "kapak-kombin", url: px("14577586"), page: "https://www.pexels.com/photo/set-of-clothes-on-white-fabric-14577586/", name: "Pegah Sharifi", profile: "https://www.pexels.com/@peg1997/", alt: "Mermer desenli zeminde pudra rengi kaban, krem balıkçı yaka triko, açık mavi jean ve krem çantadan oluşan kış kombini", retouch: [{ x: 778, y: 324, w: 130, h: 68, dx: 0, dy: 0, mode: "vinterp", note: "yaka içindeki marka etiketi çevre kumaş rengiyle dolduruldu" }] },
  { n: 61, source: "pexels", id: "8388311", slot: "alisveris-kabin", url: px("8388311"), page: "https://www.pexels.com/photo/two-women-in-the-fitting-room-8388311/", name: "Ron Lach", profile: "https://www.pexels.com/@ron-lach/", alt: "Mağaza deneme kabininde bir kadının perdenin arkasındaki arkadaşına kıyafet uzatması" },
  { n: 62, source: "pexels", id: "7679757", slot: "alisveris-kabin", url: px("7679757"), page: "https://www.pexels.com/photo/photo-of-mirror-in-the-fitting-room-7679757/", name: "MART PRODUCTION", profile: "https://www.pexels.com/@mart-production/", alt: "Butikte deneme kabini aynası ve aynada yansıyan askılı kıyafetler" },
  { n: 63, source: "pexels", id: "34923691", slot: "alisveris-pazar", url: px("34923691"), page: "https://www.pexels.com/photo/traditional-textile-shopfront-in-istanbul-34923691/", name: "Beyza Yalçın", profile: "https://www.pexels.com/@beyza-yalcin-153182170/", alt: "İstanbul Kapalıçarşı'da desenli ceketler ve ikat kumaşlar asılı bir dükkân vitrini" },
  { n: 64, source: "pexels", id: "35178088", slot: "alisveris-pazar", url: px("35178088"), page: "https://www.pexels.com/photo/colorful-street-fashion-display-in-istanbul-35178088/", name: "Zeynep Kahraman", profile: "https://www.pexels.com/@zeynep-kahraman-2157145452/", alt: "İstanbul'da mor cepheli bir dükkânın önünde asılı renkli elbiseler ve şallar, kapı önünde oturan esnaf" },
  { n: 67, source: "pexels", id: "14366434", slot: "alisveris-pazar", url: px("14366434"), page: "https://www.pexels.com/photo/head-scarf-shop-14366434/", name: "Mick Latter", profile: "https://www.pexels.com/@micklatter/", alt: "İstanbul'da bir pazarda sıra sıra asılı ve katlanmış renkli başörtüleri ile şallar", also: "tesettür alışverişi" },
  { n: 68, source: "pexels", id: "18587721", slot: "alisveris-pazar", url: px("18587721"), page: "https://www.pexels.com/photo/woman-touching-lace-cloth-at-store-retail-display-18587721/", name: "Sevgi LALE", profile: "https://www.pexels.com/@sevgiilale/", alt: "Dantel örtüler ve tekstil ürünleriyle dolu bir dükkânda ürünlere dokunan başörtülü kadın, arkadan" },
  { n: 69, source: "pexels", id: "17293347", slot: "kapak-markalar", url: px("17293347"), page: "https://www.pexels.com/photo/clothes-in-neutral-colors-hanging-on-the-racks-in-a-clothing-store-17293347/", name: "Pew Nguyen", profile: "https://www.pexels.com/@nguyendesigner/", alt: "Bir mağazada ahşap askılarda asılı krem ve bej tonlarında kıyafetler" },
];

const REJECTED: [number, string][] = [
  [4, "plaka okunuyor; kadraj göbeği öne çıkarıyor (hero için #5 seçildi)"],
  [9, "abartılı poz, dar mini elbise — cinselleştirici kadraj"],
  [10, "derin dekolte crop üst, öpücük pozu"],
  [15, "siyah-beyaz, düşük kontrast; hırka okunmuyor"],
  [20, "göğüste transparan ten rengi panel"],
  [21, "derin V dekolte"],
  [27, "tişörtte baskılı grafik/yazı"],
  [30, "göğüste marka logosu; #29 ile aynı seri (yedek)"],
  [33, "reklamvari başparmak pozu, kesik kadraj"],
  [34, "büyük beden vurgusu zayıf, slot uyumsuz"],
  [37, "göğüste marka logosu; #36 ile aynı seri (yedek)"],
  [40, "egzersiz bağlamı (kilo verme çağrışımı)"],
  [41, "ön planda kesik başka kişi, hırka okunmuyor"],
  [44, "mezurada okunur marka yazısı"],
  [58, "tişört etiketinde okunur marka adı"],
  [59, "iç giyim/bralet parçaları ve marka etiketi"],
  [60, "tişörtte belirgin marka logosu"],
  [65, "okunur yazılar (kulüp havluları, fiyat tabelaları)"],
  [66, "okunur dükkân tabelası (işletme adı)"],
  [70, "vitrinde mağaza tabelası yansıması"],
];

async function ensureRaw(item: Item): Promise<string> {
  const file = path.join(RAW_DIR, `${item.n}.jpg`);
  if (fs.existsSync(file)) return file;
  const host = new URL(item.url).host;
  if (!ALLOWED_HOSTS.has(host)) throw new Error(`İzin verilmeyen host: ${host} (#${item.n})`);
  fs.mkdirSync(RAW_DIR, { recursive: true });
  const res = await fetch(item.url);
  if (!res.ok) throw new Error(`İndirme başarısız #${item.n}: ${res.status}`);
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  return file;
}

function featherMask(w: number, h: number): Buffer {
  const r = Math.max(2, Math.round(Math.min(w, h) * 0.18));
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="f"><feGaussianBlur stdDeviation="${r / 2}"/></filter></defs>` +
      `<rect x="${r}" y="${r}" width="${w - 2 * r}" height="${h - 2 * r}" rx="${r}" fill="#fff" filter="url(#f)"/></svg>`,
  );
}

async function interpolateBox(input: Buffer, r: Box, vertical = false): Promise<Buffer> {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const at = (x: number, y: number, c: number) => data[(y * info.width + x) * ch + c];
  const avgH = (x0: number, x1: number, y: number, c: number) => {
    let t = 0;
    for (let x = x0; x <= x1; x++) t += at(x, y, c);
    return t / (x1 - x0 + 1);
  };
  const avgV = (x: number, y0: number, y1: number, c: number) => {
    let t = 0;
    for (let y = y0; y <= y1; y++) t += at(x, y, c);
    return t / (y1 - y0 + 1);
  };
  for (let y = r.y; y < r.y + r.h; y++) {
    for (let x = r.x; x < r.x + r.w; x++) {
      for (let c = 0; c < ch; c++) {
        const [A, B, t] = vertical
          ? [avgV(x, r.y - 5, r.y - 1, c), avgV(x, r.y + r.h, r.y + r.h + 4, c), (y - r.y + 0.5) / r.h]
          : [avgH(r.x - 5, r.x - 1, y, c), avgH(r.x + r.w, r.x + r.w + 4, y, c), (x - r.x + 0.5) / r.w];
        data[(y * info.width + x) * ch + c] = Math.round(A + (B - A) * t);
      }
    }
  }
  // Satır bazlı dolgu dikey çizgi bırakmasın diye bölgeye hafif bulanıklık
  const filled = await sharp(data, { raw: info }).png().toBuffer();
  const soft = await sharp(filled).extract({ left: r.x, top: r.y, width: r.w, height: r.h }).blur(2).toBuffer();
  return sharp(filled).composite([{ input: soft, left: r.x, top: r.y }]).jpeg({ quality: 95 }).toBuffer();
}

async function processItem(item: Item) {
  const rawFile = await ensureRaw(item);
  const meta = await sharp(rawFile).metadata();
  if (meta.format !== "jpeg" && meta.format !== "png") throw new Error(`#${item.n} JPEG/PNG değil: ${meta.format}`);

  let buf: Buffer = await sharp(rawFile).rotate().toBuffer();
  for (const r of item.retouch ?? []) {
    if (r.mode === "interp" || r.mode === "vinterp") {
      buf = await interpolateBox(buf, r, r.mode === "vinterp");
      continue;
    }
    const patch = await sharp(buf)
      .extract({ left: r.x + r.dx, top: r.y + r.dy, width: r.w, height: r.h })
      .ensureAlpha()
      .composite([{ input: featherMask(r.w, r.h), blend: "dest-in" }])
      .png()
      .toBuffer();
    buf = await sharp(buf).composite([{ input: patch, left: r.x, top: r.y }]).toBuffer();
  }
  let img = sharp(buf);
  if (item.crop) img = img.extract({ left: item.crop.x, top: item.crop.y, width: item.crop.w, height: item.crop.h });
  const base = await img.toBuffer({ resolveWithObject: true });
  const landscape = base.info.width >= base.info.height;
  const maxW = item.maxW ?? (landscape ? 1600 : 1200);

  const dir = path.join(OUT_DIR, item.slot);
  fs.mkdirSync(dir, { recursive: true });
  const stem = path.join(dir, `${item.source}-${item.id}`);
  const resized = sharp(base.data).resize({ width: maxW, withoutEnlargement: true });
  const jpg = await resized.clone().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(`${stem}.jpg`);
  await resized.clone().webp({ quality: 75 }).toFile(`${stem}.webp`);
  await resized.clone().avif({ quality: 50, effort: 5 }).toFile(`${stem}.avif`);
  return { width: jpg.width, height: jpg.height };
}

function credit(item: Item) {
  return `Fotoğraf: ${item.name} / ${item.source === "pexels" ? "Pexels" : "Unsplash"}`;
}

async function main() {
  const only = process.env.ONLY?.split(",").map(Number);
  const rows: string[] = [];
  for (const item of ITEMS) {
    if (only && !only.includes(item.n)) continue;
    const { width, height } = await processItem(item);
    const web = `/images/stok/${item.slot}/${item.source}-${item.id}`;
    const license = item.source === "pexels" ? "Pexels License" : "Unsplash License";
    const notes = [item.also ? `Ayrıca: ${item.also}` : "", ...(item.retouch ?? []).map((r) => `Rötuş: ${r.note}`), item.crop ? "Kırpıldı" : ""]
      .filter(Boolean)
      .join("; ");
    rows.push(
      `| ${item.slot} | #${item.n} | \`${web}.jpg\` (+ .webp, .avif) | ${item.alt} | ${credit(item)} | ${item.profile} | ${item.page} | ${license} | false | ${width}×${height} | ${notes} |`,
    );
    console.log(`✓ #${item.n} ${item.slot} ${width}x${height}`);
  }

  const md = `# Stok görsel manifestosu

Üretici: \`scripts/optimize-images.ts\` (bu dosya otomatik yazılır; elle düzenlemeyin, script'i değiştirip yeniden çalıştırın).
Aday listesi ve seçim gerekçeleri: \`docs/gorsel-adaylari.md\`. Kontrol tarihi (checkedAt): ${CHECKED_AT}.

- Her görsel üç biçimde: \`.avif\`, \`.webp\` ve JPEG yedeği (\`.jpg\`, kalite ~80). İçerikte JPEG yolu kullanılır.
- Hepsi gerçek fotoğraf: \`aiGenerated: false\`. Lisans: Pexels License / Unsplash License (ticari kullanım serbest, atıf zorunlu değil; biz atıf veriyoruz).
- \`sources\` kaydı için: url = fotoğraf sayfası, type \`stock-photo\`, label = "Atıf" sütunu, checkedAt = ${CHECKED_AT}.
- Kullanım sınırları: marka/ürün kartında kullanılmaz, kişi bir markayla eşleştirilmez, "gerçek müşteri" gibi sunulmaz; gerçek kişiye vücut tipi etiketi verilmez.
- Rötuş: görünür marka nakışı/etiketi olan 4 karede logo, komşu kumaş dokusuyla örtüldü (Pexels/Unsplash lisansı değiştirmeye izin verir). Başka değişiklik yok.

| Slot | Aday | Dosya | Alt metin | Atıf | Fotoğrafçı profili | Fotoğraf sayfası | Lisans | aiGenerated | Boyut | Not |
|---|---|---|---|---|---|---|---|---|---|---|
${rows.join("\n")}

## Elenen adaylar

| Aday | Neden |
|---|---|
${REJECTED.map(([n, why]) => `| #${n} | ${why} |`).join("\n")}

## Hâlâ boş slotlar (AI görseli veya yeni aday gerekli)

kadin-tayt, kadin-tunik, kadin-mont, erkek-jean, erkek-hirka, erkek-sweatshirt (yalnız #38 triko yedek), erkek-esofman, erkek-takim-elbise, beden rehberinde büyük beden kişide ölçü alma, vücut tipi silüetleri (10), Merter/Laleli/Osmanbey toptan pazar sokakları. Kadın hero tam boy yatay kare yok (#1–#3 belden yukarı).
`;
  if (only) return console.log("ONLY verildi: manifest yazılmadı");
  fs.writeFileSync(MANIFEST, md);
  console.log(`Manifest: ${path.relative(ROOT, MANIFEST)} (${ITEMS.length} görsel)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
