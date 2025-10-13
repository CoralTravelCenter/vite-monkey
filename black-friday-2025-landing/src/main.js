import kv from './markup/kv.html?raw';
import text from './markup/text.html?raw';
import plate from './markup/plate.html?raw';
import contacts from './markup/contacts.html?raw';
import './style.css';

const markup = kv + text + plate + contacts;
document.querySelector('#monkey-app').insertAdjacentHTML('afterbegin', markup)

// ===== Обновлённая структура отелей
window._toursByCountry = [
  {
    country: "ОАЭ",
    hotels: [
      {
        hotel: "MIRAMAR AL AQAH BEACH RESORT",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "ОАЭ, Фуджейра (Fujairah)",
        meal: "Superior Room- Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/miramar-al-aqah-beach-resort-fujairah/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGqf8o7QHB1iaxPsB5gqdZDsvFMxaBfdaQIyrkcVLtfh9Z3bk%2f%2fRMEQAim8pbiEZ3%2bfzKy8UDrivG3lGxi0nv7bKn4BvXtIGrQqzsIkPVhkSyVfzsCF8gkmW5QBGMQmctj5qlxPXLBC6qc06lKtOJOwcNNLXWzwvkANu5vktZG7WwXiIeMTdMvYKMAz4%2bTGjREF%2bZD1lMX8pPzWHE6bVCz8A%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "MIRAGE BAB AL BAHR BEACH HOTEL",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "ОАЭ, Фуджейра (Fujairah)",
        meal: "Ocean Deluxe- Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/mirage-bab-al-bahr-beach-hotel-fujairah/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGRhxhEGgSQHWqUir7iJR%2fQDdgHrveZN%2bUVuEEgPxZo6ownAygsY7CvOu0%2bNgfBT8xKwLLP8dfQjHdmOKsUqopRswcqGo1AEbJocBvnKnqy4AkNL5mVcUk%2fqibjRe8I1TmTjDXy3AYJE0ckHovpjjeATvTek6ilunLPM4iHYqRRWq%2f81Sp2OkF8SPu9RvXkatMAMc%2fVeti8oAwTCR6F8TIDQ%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "SAHARA BEACH RESORT & SPA",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "ОАЭ, Шарджа",
        meal: "Deluxe Room Balcony- Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/sahara-beach-resort-spa-sharjah/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGE6FgIoz43gu5SKahnjzMySLqd0HX8hVns75QxPSbqh9lhjZRgaoF3kLVli%2frqWlgYs8Tt5RGmMQXjsgRegq1UBU7yIC7EKw%2bVZAn9nb3CPweCe3Ap2YE%2baw7Kxls%2f3oJHHX0Ej1wkTc4zNNvJYrGVZRb4H4UYCxNADxISaoKemwMad3uBmH51Xh5VFHqVzfkyXoPqPRX3sPWEwDeF1g0uA%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "LE ROYAL MERIDIEN BEACH RESORT&SPA",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "ОАЭ, Дубай, Дубай Марина",
        meal: "Super Deluxe Sea View- Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: [],
      },
      {
        hotel: "SHERATON SHARJAH BEACH RESORT & SPA",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "ОАЭ, Шарджа",
        meal: "Deluxe Room City View- Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/sheraton-sharjah-beach-resort-spa-sharjah/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGLWjV%2bmxzuDI1s3bOqXsBlcTwslSXVqhw82SM6RSE0Ha6dZ2c5oZr2jCTRHHXtO2qWO4vEElnQzMPYE1nQkehQM2F2%2ffy%2bEuIJTtWSUfKbPWmFlmoqvquU4mV4TUrIpLlM%2bnfjxAiceyvzVW6PaUes5yURdboP9qA8q6qNWLBmYdLGvF0aZMf1g1vLql6NvEd50%2bY47Wx9laQ30VmtEy%2fEA%3d%3d&p=1&w=0&s=0&ws=10'],
      },
    ],
  },
  {
    country: "Таиланд",
    hotels: [
      {
        hotel: "CHANA HOTEL",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 3,
        location: "Таиланд, о. Пхукет (Phuket)",
        meal: "Superior - Без питания",
        nights: 11,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/thailand/chana-hotel-phuket/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANAMs82OC59UkYZW8GgNNXVCg%2fin%2b7YIy84VwVFWKNY0PZtxB3iEDsQcyw52AW2%2be%2bRa1MptvW4BspY2DU6Dc%2fPL1CSW7fnrx30hGJcdwZGLin%2bg4jVxj3LA1Voh5IHGvXLRIU4%2fgUCQzu%2fjnPUX12SV%2bqQXmBvr6EhLyoAuA%2bpoFXFWjKilLlmf5yFI2XagzzcCkJ1pvghc5HfvlEjdT1UpeHcTpK4hpJoG4zOV9avzHapTtWWvjPSW4DUjFObSGzN8%2f8KjoE80p3xmCiZFA3yQ%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "SINO MAISON PATONG",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 3,
        location: "Таиланд, о. Пхукет (Phuket)",
        meal: "Run Of House- Без питания",
        nights: 11,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/thailand/sino-maison-patong-phuket/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANAMs82OC59UkYZW8GgNNXVCg%2fin%2b7YIy84VwVFWKNY0PZtxB3iEDsQcyw52AW2%2be%2bTCFigzvsKjH3zRJYR9Cm3BydKT51ONyUTlQAASi3XmSCFAqgWYfyhg%2bBkxqU0sBz%2bGHbfRKJMF6%2b3cdScMH0%2fx%2bU1luZV5VpPlwofgUV%2fcCw9OV6duAPD%2bzuE4k9%2f8ScDRwJaVSAaf%2br4O78E1o3vIfj1VWXYYoQS0FJNZdOxY1DZJoQ%2fw7fd06oe9M5iINoU0AonK0fw7SYI5WzVNnC1w%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "BELLA NARA PHUKET NAIYANG BEACH",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Таиланд, о. Пхукет (Phuket)",
        meal: "Deluxe Pool View- Завтрак",
        nights: 11,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/thailand/bella-nara-phuket-naiyang-beach-phuket/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANAMs82OC59UkYZW8GgNNXVCg%2fin%2b7YIy84VwVFWKNY0PZtxB3iEDsQcyw52AW2%2be%2bY2on43Wh%2b0kCAaoEnAnCZ5MNXqqpjTOaAVklyN378CNqZaWiiMt%2biV7n0%2fEkzQ5PKbDt9oTeFD9t1jB3xqB6%2fyC49Nwjnf8RNTI4c3fB67%2fAL6H2csl0gwL8yd0SMIGFsdyP3R03maocsi0qxNgwgMOHLRRpPFXGdzTLII7vMiPie6uRKEzfu%2f79DBnjOlwa9S1uAM6cmmxRUuLt7HR2yw%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "LONG BEACH GARDEN HOTEL & SPA",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "Таиланд, Паттайя (Pattaya)",
        meal: "Mini Suite (2Nd Child Share Bed)- Завтрак",
        nights: 11,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/thailand/long-beach-garden-hotel-spa-pattaya/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANAMs82OC59UkYZW8GgNNXVCg%2fin%2b7YIy84VwVFWKNY0PZtxB3iEDsQcyw52AW2%2be%2bj2SjgKPWwlrLLe4jHYEkvtsNPcBleZv2bm7sG6LHL5rPPrbGHRGxaEWzD0k%2fibGThh6qUYLWuAjN%2bJy%2flf2GiesambZl3HC50lLi2fOJU77GS9ZadWDWP53GcmqjT9n7FCK48EWyDHxnDl%2bdEcQpehC8NSK4Tab5QUFcIInby%2bclkcOE3xHJg6atPfBM%2fRG1V19gZEG4vV63NQ40t9xfrQ%3d%3d&p=1&w=0&s=0&ws=10'],
      },
    ],
  },
  {
    country: "Турция",
    hotels: [
      {
        hotel: "ADALYA ELITE LARA",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Турция, Анталья (Antalya)",
        meal: "Standard Room Land View With Balcony - Ультра Все Включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/turkey/adalya-elite-lara-antalya/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGaJ2k7wBlPQLUP6qEOOSEl8ltQVPLxsZaHYkWiNafhwlKBuVvQ3QM3wcB7WuM2%2bwGvrUD%2fVeWvQuoTtVzJ7NoE11Hgt9EZzq0MP%2fkfHWk91jzlgKs63vk3mBEvZvfSfo37Czu9VBoToa1gQrWC1lX7DW5VG1pGEVtLa%2fzkihOxeKKJkvdaYZKcyIdXWu7PfmH2xkwROT3SKAHbObc9g0LKw%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "RIXOS PREMIUM TEKIROVA - THE LAND OF LEGENDS FREE ACCESS",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Турция, Кемер (Kemer), Текирова (Tekirova)",
        meal: "Deluxe Land View- Все Эксклюзивное Все Включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/turkey/rixos-premium-tekirova-the-land-of-legends-free-access-kemer/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGG7wQ3cfoXoLMWryaEPp8HxlHxT4F0idgTPspt4wZ5oW74erM6TVZ2JcrgON2wq2qVS0Y5u2vEIAn5aR70nTjmfPw0FTvrs3w1vyxiqM7Z0iW3SBdyBNuKfkpoiY3f5fMmDxwDj%2foySOd0lMwFkk%2bBF6fxk9B2m93OTePLgMvXjnndDBRHTbF5P4UugHCobH5ZuTQzbYVWc1z7X5Jl2BTpGg%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "PORT RIVER HOTEL SPA",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Турция, Сиде (Side)",
        meal: "Standard Room Land View - Премиум Ультра Все Включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/turkey/port-river-hotel-spa-side/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGdQWMmv8TMPRgyQOsniHFF7kCZed0PhsaXYBZhkUyr1NTd9QtFB1WpAAGnKuA2lLsHaWSNOjOGblNp2wMQPAV3h1OIbwLMx8cgTBkXMmxfv2YTvCX%2fqEyJ%2fkAVadQQdfg0UDZKZfurKahJE9RNtOgiEmY7WthKqrb75pSp%2b9z3hi36lTghc4lBadHk88hfMsdkXKXcmCtM6dl4ySnn%2fzF5A%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "VOYAGE BELEK GOLF & SPA",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Турция, Белек (Belek)",
        meal: "B Block Land- Ультра все включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/turkey/voyage-belek-golf-spa-belek/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGtCzzEJ91SavNnHBHyw%2bqdHjDFm6ceXM3dmNXHkQNbfHH6oVUchLhPXzx2knQiq3Zka3HPnZbBpZ87BNGiy1omL2mBrc1GAikkiQK7FJbUTNWK97kQDaUU2tKC1ieC22kx%2bkyWyq0PnC0KrsiJmA%2bz0Cr3Bjq0kzQLZoe%2bpeSpMvx0mJFiUsSK3asB4%2fJT3AzRw2Shiz5lvNcvgZZ0IF4Uw%3d%3d&p=1&w=0&s=0&ws=10'],
      },
    ],
  },
  {
    country: "Египет",
    hotels: [
      {
        hotel: "SUNNY DAYS EL PALACIO",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "Египет, Хургада (Hurghada)",
        meal: "Room Standard Pool / Lagoon View- Все Включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/sunny-days-el-palacio-hurghada/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGHSviIgig7StemTWNUBzP%2fnSQHMdEskFfkUy%2blcsGsY145uGRoItXQrIc5TIzs9Uk%2fZtiMD4xGvi%2ft8bglDYfTN3H8vUjlDDneS3ZIzPP%2fs1JYWVbF4H09WImL0yVIX7L3BKcsg9%2fMBc7TIVFhr63GLI1154q8NIanV5d76k5OEF3qQWzGcGDLiNBsbXsfDgFaq%2fQb%2b84AAARju10QJJvDw%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "XANADU MAKADI BAY",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Египет, Хургада (Hurghada)",
        meal: "Main Building Superior Room Garden View- Хай Класс Все Включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/xanadu-makadi-bay-hurghada/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGbyGXbl%2bwPWsiu5aTwbS2hjPHitZXNj%2fcGAUct6hUIbsmzyiwGf4NlkjWpCh4zYUaepaEGq4PnncQ30DUWWGVStjuvrHQSfuGU8MHAG0PPMEN7MyvCyawfqbPtxJA4g5Dx1%2b%2bUODFL2wr76PS4dKrE017ZlUCed6PpmCxtoYeEaTmozkDXBF5D979h7ZpTzYuyFy3WdcYmDx6561k9gJ%2b0A%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "TITANIC RESORT & AQUA PARK",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Египет, Хургада (Hurghada)",
        meal: "Coral Standard Room- Ультра все включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/titanic-beach-spa-aqua-park-hurghada/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGads47%2ftyngr%2bwF%2fQ1QWdDhUnYHjRm6wpNVE8mPJKCbXTMFU9vq8gE9KWEO%2fnzkqB2MZMf1ayBA%2fCg4WBGVQL5vhM6kRwJf4Q4tFPPlU8TKR%2bEpRbYgPWCMCSoEfVIz1W2EOR%2bD5RQi%2bNMwtG10y471JrOyVHSrcsZCf%2bvicWgWojcL9HC1A%2bfgbYqdbvmqXKUURih%2fNExscV9hnzO5k9Qw%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "ISLAND VIEW",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "Египет, Шарм-эш-Шейх",
        meal: "Standard Room- Все Включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/island-view-sharm-el-sheikh/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGrRmaw4ZOtd5VGP2%2ffuUYJVoHNDZJpEN4VaKbaZ3ylL4YJXvpC0atI406F9Wodjmv4STGb%2folJPKnEoARE0%2b77XRrFus9vIp3IPMOr6ZRGK31a2ydjYlV3%2fKY8ti7FkTB%2f5gu9%2bFcF6yDg4O9l2TGpqmC8et3SDW7GCP4Vdg460fo5bTTI07YrLjlTYWfZXenAmpUYFnV%2bePjY7wShSSVVw%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "SEAGULL BEACH RESORT & CLUB",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "Египет, Хургада (Hurghada)",
        meal: "Room Standard - Все Включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/seagull-beach-resort-club-hurghada/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGG0y7ajqdEMkSrQX5G5wxlFuBPetZl0iI5Hrmwxm5mdu2ywWiuakq51iahmgj9OEq9sNNlXFk5EiM8UmGLrj1pOxYk7Bhb3OsKQgYFGi5dp0WwNwxdKH%2fyVda1htUT%2b026cu%2bL%2bjw9cupAmuqnQm6yM%2bRBcQrxV03hcMKb%2b3fqX4bNGwFk6olARSqOswP8ltpLJ%2f3wIq7W5YJg1bmsYeoOVQ%3d%3d&p=1&w=0&s=0&ws=10'],
      },
    ],
  },
];

async function hostReactAppReady(selector = "#__next > div", timeout = 300) {
  return new Promise((resolve) => {
    const waiter = () => {
      const host_el = document.querySelector(selector);
      if (host_el?.getBoundingClientRect().height) resolve();
      else setTimeout(waiter, timeout);
    };
    waiter();
  });
}

/* ===========================
 *СЕТЕВОЙ СЛОЙ (DOM-нечувствительный)
 * =========================== */
const ENDPOINTS = {
  listArrivalLocations: '/endpoints/PackageTourHotelProduct/ListArrivalLocations',
  listAvailableDates: '/endpoints/PackageTourHotelProduct/ListAvailableDates',
  listAvailableNights: '/endpoints/PackageTourHotelProduct/ListAvailableNights',
  priceSearchList: '/endpoints/PackageTourHotelProduct/PriceSearchList',
};

const MOSCOW_DEPARTURE = {
  id: '2671-5',
  name: 'Москва',
  type: 5,
  friendlyUrl: 'moskva'
};

/** Таймаут-обёртка для fetch */
function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, {...options, signal: controller.signal})
    .finally(() => clearTimeout(id));
}

/** Ретраи с экспоненц. бэкоффом и джиттером для 5xx/сетевых ошибок */
async function fetchJSON(url, body, method = 'POST', {retries = 3, timeoutMs = 12000} = {}) {
  let attempt = 0;
  let lastErr;
  while (attempt <= retries) {
    try {
      const res = await fetchWithTimeout(url, {
        method,
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: method === 'POST' ? JSON.stringify(body ?? {}) : undefined,
      }, timeoutMs);

      if (!res.ok) {
        // 5xx — кандидат на повтор
        if (res.status >= 500 && res.status < 600 && attempt < retries) {
          attempt++;
          const backoff = Math.min(1500 * 2 ** (attempt - 1), 6000);
          const jitter = Math.random() * 300;
          await new Promise(r => setTimeout(r, backoff + jitter));
          continue;
        }
        throw new Error(`API Error: ${res.status} ${res.statusText} for ${url}`);
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
      // AbortError/сети — тоже повторяем
      if ((err?.name === 'AbortError' || err?.message?.includes('Network')) && attempt < retries) {
        attempt++;
        const backoff = Math.min(1500 * 2 ** (attempt - 1), 6000);
        const jitter = Math.random() * 300;
        await new Promise(r => setTimeout(r, backoff + jitter));
        continue;
      }
      break;
    }
  }
  throw lastErr || new Error(`Unknown fetch error for ${url}`);
}

async function fetchArrivalLocations(searchTexts) {
  const results = await Promise.all(
    searchTexts.map(text =>
      fetchJSON(ENDPOINTS.listArrivalLocations, {
        departureLocations: [MOSCOW_DEPARTURE],
        text
      })
    )
  );
  const wanted = new Set(searchTexts.map(s => s.trim().toUpperCase()).filter(Boolean));
  const byId = new Map();
  for (const r of results) {
    const locations = r?.result?.locations ?? [];
    for (const loc of locations) {
      const nameU = (loc.name || '').trim().toUpperCase();
      if (wanted.has(nameU)) byId.set(loc.id, loc);
    }
  }
  return [...byId.values()];
}

function fetchPrices(arrivalLocation, beginDate, nightsValue) {
  console.log(arrivalLocation, beginDate, nightsValue);
  return fetchJSON(ENDPOINTS.priceSearchList, {
    searchSource: 0,
    searchCriterias: {
      flightType: 2,
      reservationType: 1,
      beginDates: beginDate,
      datePickerMode: 0,
      nights: [{value: nightsValue}],
      roomCriterias: [{passengers: [{age: 20, passengerType: 0}, {age: 20, passengerType: 0}]}],
      departureLocations: [MOSCOW_DEPARTURE],
      arrivalLocations: [arrivalLocation],
      paging: {pageNumber: 1, pageSize: 20, sortType: 0},
      imageSizes: [4],
      categories: [],
      additionalFilters: [],
    },
  });
}

/* ===========================
 *  УТИЛИТЫ
 * =========================== */
const YM_ID = 96674199;

function toDate(d) {
  const [y, m, dd] = String(d).split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, dd));
}

function inRange(d, start, end) {
  const t = toDate(d).getTime();
  return t >= toDate(start).getTime() && t <= toDate(end).getTime();
}

function filterDatesInRange(apiDates, start, end) {
  return (apiDates || []).map(x => x.date).filter(d => inRange(d, start, end));
}

function findByField(arr, key, value) {
  if (!Array.isArray(arr)) return null;
  return arr.find(it => it && it[key] === value) || null;
}

function formatPrice(num) {
  const formatted = new Intl.NumberFormat('ru-RU').format(num ?? 0);
  return formatted.split(',')[0];
}

/* =================================================================
 *  ВСЁ, ЧТО ВЗАИМОДЕЙСТВУЕТ С DOM
 * ================================================================= */
;(async () => {
  await hostReactAppReady();

  const SEL = {
    navButtons: '.tabs-nav [data-tab-button]',
    panels: '.tab-content[data-tab-content]',
    activeClass: 'js-active',
    cardsContainer: '.cards-container',
    loadingBox: '.loading-box',
  };

  const $ = (r, s) => r.querySelector(s);
  const $all = (r, s) => Array.from(r.querySelectorAll(s));

  function ensureCardsContainer(panelEl) {
    let box = $(panelEl, SEL.cardsContainer);
    if (!box) {
      box = document.createElement('div');
      box.className = 'cards-container';
      box.id = 'cards-container';
      panelEl.appendChild(box);
    }
    return box;
  }

  /** Лоадер внутри контейнера карточек */
  function ensureLoadingBox(cardsBox) {
    let box = cardsBox.querySelector(':scope > .loading-box');
    if (!box) {
      box = document.createElement('div');
      box.className = 'loading-box';
      box.innerHTML = `<span class="loader-text">Загружаем отели…</span>`;
      box.style.cssText = `
        display:none;
        width:100%;
        text-align:center;
        padding:20px;
        font-size:16px;
        color:#555;
        font-weight:500;
      `;
      if (!document.getElementById('loader-blink-style')) {
        const style = document.createElement('style');
        style.id = 'loader-blink-style';
        style.textContent = `
          .loader-text { animation: blink 1.2s ease-in-out infinite; }
          @keyframes blink { 0%,100% { opacity: .3 } 50% { opacity: 1 } }
        `;
        document.head.appendChild(style);
      }
      cardsBox.appendChild(box);
    }
    return box;
  }

  function buildRangeAndPriceButton(data) {
    const btn = document.createElement('coral-button');
    btn.setAttribute('trait', 'vivid');
    btn.setAttribute('shape', 'pill');
    btn.setAttribute('style', '--roundness: 8px');
    btn.innerHTML = `<a href="${data.url || '#'}">${data.displayPricePerNight ? `от ${data.displayPricePerNight} ₽ /<small>за ночь</small>` : 'Кнопка'}</a>`;
    return {priceButton: btn};
  }

  /** ИКОНКИ (без даты) — исправленные path’ы */
  function createInfoIcons(data) {
    const info = document.createElement('div');
    info.className = 'info-icons';
    info.innerHTML = `
      <div class="icon-wrapper">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M1.3335 6.66675C1.3335 5.56218 2.22893 4.66675 3.3335 4.66675H12.6668C13.7714 4.66675 14.6668 5.56218 14.6668 6.66675V8.00008H1.3335V6.66675Z" stroke="#535353" stroke-width="0.7" stroke-linejoin="round"/>
            <path d="M1.3335 8H14.6668V11H13.0002L12.0002 9.66667H4.00016L3.00016 11H1.3335V8Z" stroke="#535353" stroke-width="0.7" stroke-linejoin="round"/>
            <path d="M2 2.66675C2 1.56218 2.89543 0.666748 4 0.666748H12C13.1046 0.666748 14 1.56218 14 2.66675V4.66675H2V2.66675Z" stroke="#535353" stroke-width="0.7" stroke-linejoin="round"/>
            <path d="M4.3335 3.66675C4.3335 3.11446 4.78121 2.66675 5.3335 2.66675H6.00016C6.55245 2.66675 7.00016 3.11446 7.00016 3.66675V4.66675H4.3335V3.66675Z" stroke="#535353" stroke-width="0.7" stroke-linejoin="round"/>
            <path d="M9 3.66675C9 3.11446 9.44772 2.66675 10 2.66675H10.6667C11.219 2.66675 11.6667 3.11446 11.6667 3.66675V4.66675H9V3.66675Z" stroke="#535353" stroke-width="0.7" stroke-linejoin="round"/>
          </svg>
        </div>
        ${data.nights || 7} н
      </div>

      <div class="icon-wrapper">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path d="M4.892 5.983a2.47 2.47 0 0 1 0-4.941" stroke="#535353" stroke-width=".8" stroke-linejoin="bevel"/>
            <path d="M.5 10.375a4.39 4.39 0 0 1 4.392-4.392" stroke="#535353" stroke-width=".8" stroke-linejoin="bevel"/>
            <circle cx="8.833" cy="3.667" r="2.625" stroke="#535353" stroke-width=".8" stroke-linejoin="bevel"/>
            <path d="M4.167 10.958a4.667 4.667 0 1 1 9.333 0" stroke="#535353" stroke-width=".8" stroke-linejoin="bevel"/>
          </svg>
        </div>
        ${data.passengers || 'на двоих'}
      </div>

      <div class="icon-wrapper">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="m3.558 2.845 -1.88 .684 2.82 2.875 7.518 -2.736 a1 1 0 1 0 -.684 -1.88 L9.05 2.62 7.01 .914 l-2.42 .172 1.64 2.56 -1.32 .48 z M.333 9.333 h13.334" stroke="#535353" stroke-width=".8" stroke-linejoin="round"/>
          </svg>
        </div>
        ${data.departure || 'из Москвы'}
      </div>
    `;
    return info;
  }

  function buildHotelCard(data) {
    const root = document.createElement('div');
    root.className = 'hotel-card';
    root.setAttribute('data-hotel', data.hotel);

    const visualWrap = document.createElement('div');
    visualWrap.className = 'visual';
    const img = document.createElement('img');
    img.src = data.visual || '';
    img.alt = data.hotel;
    visualWrap.append(img);

    const content = document.createElement('div');
    content.className = 'content';

    const top = document.createElement('div');
    top.className = 'top';
    top.innerHTML = `
      <div class="hotel-location">
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
          <path d="M12.8335 5.66683C12.8335 9.72673 8.50008 14.6668 8.50008 14.6668C8.50008 14.6668 4.16675 9.72673 4.16675 5.66683C4.16675 3.2736 6.10685 1.3335 8.50008 1.3335C10.8934 1.3335 12.8335 3.2736 12.8335 5.66683Z" stroke="#535353" stroke-width="0.5" stroke-linejoin="round"/>
          <path d="M8.5 7.66699C9.60457 7.66699 10.5 6.77156 10.5 5.66699C10.5 4.56242 9.60457 3.66699 8.5 3.66699C7.39543 3.66699 6.5 4.56242 6.5 5.66699C6.5 6.77156 7.39543 7.66699 8.5 7.66699Z" stroke="#535353" stroke-width="0.5" stroke-linejoin="round"/>
        </svg>
        ${data.location}
      </div>
      <div class="hotel-name">${data.hotel}</div>
      <div class="rating">${
      `<span class="star"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M15.0733 5.16238L10.5394 4.50345L8.5126 0.394524C8.45725 0.282024 8.36618 0.190952 8.25367 0.135595C7.97153 -0.00369038 7.62867 0.112381 7.4876 0.394524L5.46082 4.50345L0.926889 5.16238C0.801889 5.18024 0.687603 5.23917 0.600103 5.32845C0.494321 5.43718 0.43603 5.58345 0.438039 5.73514C0.440048 5.88682 0.502192 6.0315 0.610817 6.13738L3.89117 9.3356L3.11617 13.8517C3.098 13.9567 3.10963 14.0648 3.14973 14.1635C3.18984 14.2623 3.25682 14.3479 3.34308 14.4106C3.42935 14.4732 3.53144 14.5104 3.63778 14.518C3.74413 14.5256 3.85047 14.5032 3.94475 14.4535L8.0001 12.3213L12.0555 14.4535C12.1662 14.5124 12.2947 14.532 12.418 14.5106C12.7287 14.457 12.9376 14.1624 12.884 13.8517L12.109 9.3356L15.3894 6.13738C15.4787 6.04988 15.5376 5.9356 15.5555 5.8106C15.6037 5.4981 15.3858 5.20881 15.0733 5.16238Z" fill="#FADB14"/></svg></span>`.repeat(data.rating || 0)
    }</div>
    `;

    const mealEl = document.createElement('div');
    mealEl.className = 'meal';
    mealEl.textContent = data.meal || '';

    const {priceButton} = buildRangeAndPriceButton(data);
    const infoIcons = createInfoIcons(data);

    const packageEl = document.createElement('div');
    packageEl.className = 'package';
    packageEl.textContent = data.package || '';

    content.append(top, mealEl, infoIcons, packageEl, priceButton);
    root.append(visualWrap, content);

    priceButton.addEventListener('click', (ev) => {
      const link = priceButton.querySelector('a');
      if (link) {
        ev.preventDefault();
        if (typeof ym === 'function') ym(YM_ID, 'reachGoal', 'select-tour-page-podborka', {hotel: data.hotel});
        window.open(link.href, '_blank');
      }
    });

    return root;
  }

  /** === ГЛАВНЫЙ ПАЙПЛАЙН ЗАГРУЗКИ ТАБА (1 отель = 3 запроса после батча arrivals) === */
  async function loadTabDataIntoPanel(panelEl, tabConfig, cacheKey) {
    const cardsBox = ensureCardsContainer(panelEl);
    const loadingBox = ensureLoadingBox(cardsBox);

    cardsBox.innerHTML = '';
    cardsBox.appendChild(loadingBox);
    loadingBox.style.display = 'block';

    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      JSON.parse(cached).forEach(h => cardsBox.appendChild(buildHotelCard(h)));
      loadingBox.style.display = 'none';
      return;
    }

    try {
      const hotels = tabConfig.hotels || [];
      if (!hotels.length) {
        loadingBox.style.display = 'none';
        return;
      }

      // 1) Arrival locations батчем
      const hotelNames = hotels.map(h => h.hotel);
      const arrivalLocations = await fetchArrivalLocations(hotelNames);
      const byName = new Map();
      for (const a of arrivalLocations) byName.set((a.name || '').trim().toUpperCase(), a);

      const collected = [];

      // 2-4) По каждому отелю: AvailableDates → AvailableNights → PriceSearchList (одна дата)
      for (const hotel of hotels) {
        const arrival = byName.get((hotel.hotel || '').trim().toUpperCase());
        if (!arrival) continue;

        const priceResp = await fetchPrices(arrival, hotel.dates, hotel.nights);
        const firstProduct = priceResp?.result?.products?.[0];
        const amount = firstProduct?.offers?.[0]?.price?.amount || null;
        const imgUrl = firstProduct?.hotel?.images?.[4]?.sizes?.[0]?.url || null;

        // Сервер даёт «самую доступную» — считаем «за ночь/на человека»
        const perNightPerPerson = amount != null ? Math.round(amount / 7 / 2) : null;
        const displayPricePerNight = perNightPerPerson != null ? formatPrice(perNightPerPerson) : '';

        const renderModel = {
          ...hotel,
          displayPricePerNight,
          url: hotel.urls?.[0] || '#',
          visual: imgUrl || hotel.visual || '',
        };

        collected.push(renderModel);
        cardsBox.appendChild(buildHotelCard(renderModel));
      }

      sessionStorage.setItem(cacheKey, JSON.stringify(collected));
    } catch (e) {
      console.error('Ошибка загрузки данных', e);
      const err = document.createElement('div');
      err.style.cssText = 'text-align:center;color:#c00;padding:12px;';
      err.textContent = 'Не удалось загрузить отели. Попробуйте позже.';
      cardsBox.appendChild(err);
    } finally {
      loadingBox.style.display = 'none';
    }
  }

  /* ===========================
   *  ИНИЦИАЛИЗАЦИЯ И ТАБЫ
   * =========================== */
  (function initTabsBinding() {
    const buttons = $all(document, SEL.navButtons);
    const panels = $all(document, SEL.panels);
    if (!buttons.length || !panels.length) return;

    function activateByCountry(country) {
      const btn = buttons.find(b => (b.getAttribute('data-tab-button') || '').trim() === country.trim());
      const panel = panels.find(p => (p.getAttribute('data-tab-content') || '').trim() === country.trim());
      if (!btn || !panel) return null;

      buttons.forEach(b => b.classList.remove(SEL.activeClass));
      panels.forEach(p => p.classList.remove(SEL.activeClass));
      btn.classList.add(SEL.activeClass);
      panel.classList.add(SEL.activeClass);
      return panel;
    }

    function cfgIndexByCountry(country) {
      return (window._toursByCountry || []).findIndex(c => (c.country || '').trim() === country.trim());
    }

    // Первая активная
    const initialBtn = buttons.find(b => b.classList.contains(SEL.activeClass)) || buttons[0];
    if (!initialBtn) return;
    const initialCountry = initialBtn.getAttribute('data-tab-button').trim();
    const initialPanel = activateByCountry(initialCountry);

    const i = cfgIndexByCountry(initialCountry);
    if (i >= 0 && initialPanel) {
      loadTabDataIntoPanel(initialPanel, window._toursByCountry[i], `hotelData_${initialCountry}`);
      if (typeof ym === 'function') ym(YM_ID, 'reachGoal', 'country-filter', {country: initialCountry});
    }

    // Переключение
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const country = btn.getAttribute('data-tab-button').trim();
        if (typeof ym === 'function') ym(96674199, 'reachGoal', 'bf_25_country', {bf_country: country});
        const panel = activateByCountry(country);
        const idx = cfgIndexByCountry(country);
        if (idx >= 0 && panel) {
          loadTabDataIntoPanel(panel, window._toursByCountry[idx], `hotelData_${country}`);
          if (typeof ym === 'function') ym(YM_ID, 'reachGoal', 'country-filter', {country});
        }
      });
    });
  })();
})();
