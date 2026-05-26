import kv from './markup/kv.html?raw';
import text from './markup/text.html?raw';
import plate from './markup/plate.html?raw';
import contacts from './markup/contacts.html?raw';
import podborka from './markup/podborka.html?raw';
import './style.css';

const markup = kv + text + plate + podborka + contacts;
document.querySelector('#monkey-app').insertAdjacentHTML('afterbegin', markup)

// ===== Обновлённая структура отелей
window._toursByCountry = [
  {
    country: "ОАЭ",
    hotels: [{
      hotel: "RIXOS MARINA ABU DHABI",
      dates: ["2025-11-17", "2025-11-30"],
      rating: 5,
      location: "ОАЭ, Абу-Даби (Abu Dhabi)",
      meal: "Deluxe Room Corniche View - Завтраки",
      nights: 7,
      passengers: "на двоих",
      departure: 'Москва',
      package: "Перелет включен",
      urls: ['https://www.coral.ru/hotels/united-arab-emirates/rixos-marina-abu-dhabi-abu-dhabi/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGG8zJDNxSZzVwdGbs0GPh4DBzqYao5l7sBBAEkhCCpx3EoGadho28OfDYPDrNCfccDqdLPulYy9F9CAtd3XQLziHaLZABWQLG%2fiZauu0Uw9vnQnxunuALQpA5DQafNM%2f3UWnzBEeamkN0zOFjR7jnMRsBarCsqFVlg53gu7Wvl4EmSQVPY9uLIkKSy1oE0KoRc2s6Q69%2bZpzlIlM2uaSzTLQ%3d%3d&p=1&w=0&s=0&ws=10'],
    },
      {
        hotel: "RIXOS PREMIUM SAADIYAT ISLAND",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "ОАЭ, Абу-Даби (Abu Dhabi)",
        meal: "Premium Pool Access Room - Ультра все включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/rixos-premium-saadiyat-island-abu-dhabi/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGmTq4f5ndL6u6xXXuI0EhP1egjh6IabWhLlc6L%2fLzEQ531J4XgFG2Wa7YJgWbaoLEclJ8X18IjLurs%2b9CaUqUINzYDPtcku3Z0lDqya4LA%2bAg6FEFlnzpzZT%2fMNz%2fT1Xf9qrY3A1%2bTbIEz0z1Pg74Oj74QxQY6DQZ7i50tunaK42219r8Iaxt4v90AjaufpZIqXknGn9Mh6l9ntCFC1qQAQ%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "SOFITEL ABU DHABI CORNICHE",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "ОАЭ, Абу-Даби (Abu Dhabi)",
        meal: "Superior Room Twin - Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/sofitel-abu-dhabi-corniche-abu-dhabi/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGG20X3BVl00o%2bDtLa577xY1QiCmxCC%2bA4Vk48aHD%2bMCI7pb6pYzbmkGD8jTT%2f8NVPlKUS7ETKlvCFcdI8kq7ZElvCUsPDNBRZoG%2fQXVLDHUaPdLKWUVdREFqggnT9faoscAHNtqyJLBqoHiA9jgaVGgTdfneeighQWBNV6eZN%2bvnl9ysZvyHX8X9odWUHIqmL8kEYB9e0p0zEGdslwPpgC8w%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "MILLENNIUM DOWNTOWN ABU DHABI",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "ОАЭ, Абу-Даби (Abu Dhabi)",
        meal: "Standard Room - Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/millennium-downtown-abu-dhabi-abu-dhabi/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGuEco%2f5c2WcWbpBmROV%2foO8syD%2bd4Tic1B0lpwGMSrkBizpMvegxAkGfHhCr5Cr1xXJH3B7kk7PRNrzCItW9G10rbi9ROAVWgoi%2fnF3m1ZgA8Ip%2b6c2xiEUSspqr6lvpTj4t8q3XBEQYbMfZuwC2LIdmq4zKUNOBu77IqrszjlRBW9fAIL4NaTqpbHTKndGe%2f%2br1%2fgFvBAzZYe3CKlINkdg%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "COPTHORNE DOWNTOWN ABU DHABI",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "ОАЭ, Абу-Даби (Abu Dhabi)",
        meal: "Deluxe Room - Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/copthorne-downtown-abu-dhabi-abu-dhabi/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGwxmaupirt%2flwTA3qhYy1uQWvYcZCkDp8ypRFZ9UhNEzHy2H%2fa5L%2b3vbZBNBkxdbGZ86sH4%2fkFcELyfqEYOeO%2fSN0BNi1KYExrHRC3HrQlZBQsk26WVmosxu8fMk%2b4n7MCP7rm%2bYYDahwluCj6YnmxtNZ3wrisc%2fa%2b4Slmae62x8E4jlZGgpBAESxynf%2b7Oio1alzm4aJZe0Q0nfIfmUf0A%3d%3d&p=1&w=0&s=0&ws=10'],
      },

      {
        hotel: "SHERATON DUBAI MALL OF THE EMIRATES HOTEL",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "ОАЭ, Дубай, Аль Барша (Al Barsha)",
        meal: "Deluxe Room - Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/sheraton-dubai-mall-of-the-emirates-hotel-dubai/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGeZP3r6PwSHvjQhN%2bjq696d6h317EhYV6xl6X34EdBnIJoOAEeUMGCXi%2fuDRsbnBCA1a70S8nMnauaahimwqy019cFuKI1tl%2fg4awLD78JF7OlSC%2fyivtS7jF%2fM7bFRMEqMiHwZAtFUj5fK2lQqSxvh4qHZfVgVHtrPA2a8kXBH7KP2v8mWxylFppsLbI16PtXhxJ0xqkvhHiJ2cOYA0lmw%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "ADDRESS BEACH RESORT",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "ОАЭ, Дубай, Дубай Марина (Dubai Marina)",
        meal: "Deluxe Marina City View Room With Balcony - Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/address-beach-resort-dubai/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGG60xAKsy4f1cbf7dyL3Qo4BRX0GtaVXo8M4kotBAx4xBF8%2fKRoc8wFZZVMQ3z0CbAEKL5bn13WL8BBbFv6xdLDyPtgj9Jn%2bvxUhJWwePbNxhu8F64C49%2fo0q8SGiNzZPp9Ja5wpp7Gqtgymfo1aLcR4H5V3E%2bwuij%2fi%2fqTNzuRcHHX6DEkQwxAgawjJFOgEdOSCCKsVxAty6RSAWqmy4nag%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "TIME OAK HOTEL & SUITES",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "ОАЭ, Дубай, Аль Барша (Al Barsha)",
        meal: "One Bedroom - Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/time-oak-hotel-suites-dubai/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGCt3V0kXZnnykKQdFURfS0y3DZufsuvDSrIj3aLhdfv3DUfMr1ajSmMV2Xu7Xw9RFXznG7Nj0xMXymRJTZfvZbu5k7r0A9v26n4qGWNuFS1LaggoQ%2f4aMLPCyEJIMFQ4GB1gqz7aGMElWQXqOWKBn2vluLvo7ijGYcwJMzTFZJ4Z5pduUKKibg9T8Z1Y5aaog5a0ZhFNSR6vj%2fhuQucvRFg%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "MILLENNIUM AL BARSHA MALL OF THE EMIRATES",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "ОАЭ, Дубай, Аль Барша (Al Barsha)",
        meal: "Deluxe King/Twin - Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/time-oak-hotel-suites-dubai/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGCt3V0kXZnnykKQdFURfS0y3DZufsuvDSrIj3aLhdfv3DUfMr1ajSmMV2Xu7Xw9RFXznG7Nj0xMXymRJTZfvZbu5k7r0A9v26n4qGWNuFS1LaggoQ%2f4aMLPCyEJIMFQ4GB1gqz7aGMElWQXqOWKBn2vluLvo7ijGYcwJMzTFZJ4Z5pduUKKibg9T8Z1Y5aaog5a0ZhFNSR6vj%2fhuQucvRFg%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "ROVE DOWNTOWN DUBAI",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 3,
        location: "ОАЭ, Дубай, Даунтаун ОАЭ (Down Town-UAE)",
        meal: "Rover Room - Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/rove-downtown-dubai-dubai/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGdiiO3o6ao54cXAoIVZ3a5jzVzBa18C4qZ7DQ5zmIXBziGDXXCy1raPs8CQOAfjCDHdf2tS7KgITyvRwS35P2HtlDpVTMFpG%2ftWnh6ziHJw7FmYx4boFu1jRxmYrrhEEio77GXup%2bMaPljsjDwfsZr9Fkr%2bpwVT7enxo3WQccO%2fFEjMqHKY2x8OuikpB9PtHjONaIinMzKNANU4T6DTqfnw%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "ROVE CITY WALK\n",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 3,
        location: "ОАЭ, Дубай, Шейх Заед Роуд (Sheikh Zaid Road)",
        meal: "Rover Room - Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/united-arab-emirates/rove-city-walk-dubai/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGVCs4LC5kJjqTWYzE9f408yD43x%2f0vOr6giYSQuXZcIiO30V5AGr5do%2bfsGt15KkvPNE5aWOxv0YHa%2bC5%2bCXak0ICuklln9eiB8oevHZWBWtEunBWmZnQQAZn9ok5lze4W123IPyay1iFo0DoJuV5jpKbnfvPV5ODqx%2fJrvjTMk4yHdrj3BskyYK70x%2b6HsrBwqh%2fK%2f5Im5%2f9r5PGFm6USA%3d%3d&p=1&w=0&s=0&ws=10'],
      },
    ],
  },
  {
    country: "Таиланд",
    hotels: [{
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
        hotel: "MEGASARAY WESTBEACH ANTALYA",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Турция, Анталья (Antalya)",
        meal: "Deluxe Room City View- Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: "Москва",
        package: "Перелет включен",
        urls: [
          "https://www.coral.ru/hotels/turkey/megasaray-westbeach-antalya-antalya/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGBGVAp%2fQI1Jhpk7SLK5lCDgJJnvWBCOUbACXoQKrV%2f5XEXVsD0eruXpn0tPSRjmzG3OWpTEB%2bGq%2fXJoB7kQJbXd9cRD1ZWMKrE%2fdn1KfgZYj780UT9A0VW2S5Ov5oBRMzs0SAWX0unxvqd3YI1LzNXHu3mRF942nHwMilflOsju%2bn%2bC4mKE1hEWloZbQUoagQ%2b%2fGuEWu9VLMuPQnQNXKmww%3d%3d&p=1&w=0&s=0&ws=10",
        ],
      },
      {
        hotel: "AKRA ANTALYA",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Турция, Анталья (Antalya)",
        meal: "Deluxe Room City View- Без питания",
        nights: 7,
        passengers: "на двоих",
        departure: "Москва",
        package: "Перелет включен",
        urls: [
          "https://www.coral.ru/hotels/turkey/akra-antalya-antalya/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGx%2fXnNarFr5vWovsSn3%2f5vKMUWBc4PfbRwuJEORruZxOo1FBA5BnjiRyYta96cvq%2fmA%2fk%2fO%2bQwTmR6NKmrU4JjusL0IFjIkZtf2T%2fuhBnejpAztvs8sGVNXCU7VRBvlSKoUMwUeib25lxcaCvtkeGbFXOk%2fxv%2bQda071JghCZCR1rWyJVenolYSHL2UHhpP8nGLr72uY7MgrEwD951wCpyA%3d%3d&p=1&w=0&s=0&ws=10",
        ],
      },
      {
        hotel: "TUVANA HOTEL OLD TOWN",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "Турция, Анталья (Antalya)",
        meal: "Standard Room- Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: "Москва",
        package: "Перелет включен",
        urls: [
          "https://www.coral.ru/hotels/turkey/tuvana-hotel-old-town-antalya/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGfHHQgs6YtCK9gaiEcLozo53391zhlHQWKtqs0U%2bsWVxolCVjnh2AbllxNUp9prGvs%2buF%2b3CElAbxNEZ0epctId94%2bge5e7bJ5fbSYysSuc8N4N51ALwq1mR65IE6p6XrJXk9XAMmhtrWbFd9d1x8mxZyc%2bqbjhFy5qKWGRd2lUTax9rBpKC7LGb0PknZxvJEHej4e6%2bvHCbpPIOcc%2bt2JQ%3d%3d&p=1&w=0&s=0&ws=10",
        ],
      },
      {
        hotel: "FALCON HOTEL",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "Турция, Анталья (Antalya)",
        meal: "Standard Room Land View- Завтраки",
        nights: 7,
        passengers: "на двоих",
        departure: "Москва",
        package: "Перелет включен",
        urls: [
          "https://www.coral.ru/hotels/turkey/falcon-hotel-antalya/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGcKy2boTKBdrflfGSmZoAcUc9B9CUiZcSMR0QZnDHg6wApAZYPj%2fOg4vYWninC%2b4wIkS8SwZn%2flmKtC9W3L%2frysH5%2bgChQ7Yaokkis%2bTaTHJSrZS6Skew8OdSVKVltrcKQP%2fJIOkY8A8ZT9Xhy1IDWl6F21vCxpmrw4ooFJMZyLNc00AaC5q9%2b%2b0ajRnQfJLMy%2bFQITgZj3R8SqW%2bYTrG3w%3d%3d&p=1&w=0&s=0&ws=10",
        ],
      },

      {
        hotel: "PRIMA HOTEL",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 3,
        location: "Турция, Анталья (Antalya)",
        meal: "Standard Room- Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: "Москва",
        package: "Перелет включен",
        urls: [
          "https://www.coral.ru/hotels/turkey/prima-hotel-antalya/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGWaXN2UouJWsVq3QD6AHpHCGQCGX6xwJiYudx2ryLtv%2f2MXDNf35H1rydNC28s2cP0%2bUBGSSeSn0kjXN1n7s0W7%2fy%2b6ba%2bJBCJZKicLi7JFzXfdSpEr3Mfv3Lg%2boSe46WMGhjK26m8RcDn2JJm6RZSfZSHT%2fSCttIUslzFP%2bE1fGv4v1JXCZvYm41rdCnHK0wA7wSEuYdt%2f%2fvNs89MZkeIw%3d%3d&p=1&w=0&s=0&ws=10",
        ],
      },


      {
        hotel: "RIXOS PERA ISTANBUL",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Турция, Стамбул (Istanbul)",
        meal: "Deluxe Room- Без питания",
        nights: 7,
        passengers: "на двоих",
        departure: "Москва",
        package: "Перелет включен",
        urls: [
          "https://www.coral.ru/hotels/turkey/rixos-pera-istanbul-istanbul/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGpMqetXExahYAMxZsvG1T2iFfutZjBnWjuLjQbWn8CPH1j%2b8s2M3cX2bk%2fi%2bqIMxMQDNEUfRtUKJKEBMRxNnQrFrzTTYDApFwNpGjfU8zKbyAkxsKxLxrjLfYvLBwGx41DPONf9QqMrdmDVORWqqJYJ86NXkrQC6ANfUZ9P9FdZkruJDqtUiAlr4dv0hcKLXIv5FlxCA71zBycyck7OsxRw%3d%3d&p=1&w=0&s=0&ws=10",
        ],
      },

      {
        hotel: "RIXOS TERSANE ISTANBUL",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Турция, Стамбул (Istanbul)",
        meal: "Premium Room- Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: "Москва",
        package: "Перелет включен",
        urls: [
          "https://www.coral.ru/hotels/turkey/rixos-tersane-istanbul-istanbul/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGfb1b6IePM9fjT6WduNtdk1ytL9V4dI%2fusxWqOSWIscR7lhEHAvf7roe%2fQYKXEWlXEWJNDnv744vje7XiC6jJ4K%2fs8Vbb9vwqrsHoy4oQYjDyF3BL%2fz%2fC3XcwtPmS7AjYca434jYbLg32JkkxDEORBOwW8k5t%2fTrMc9jUv%2fT%2fGv3pwQCTLP7kq6Bf8PatNPYTOkoMW5R2HLABEIESWm7c7w%3d%3d&p=1&w=0&s=0&ws=10",
        ],
      },

      {
        hotel: "AKKA LUSH HOTEL",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "Турция, Стамбул (Istanbul)",
        meal: "Standard Room No View Twin Bed- Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: "Москва",
        package: "Перелет включен",
        urls: [
          "https://www.coral.ru/hotels/turkey/akka-lush-hotel-istanbul/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGeqRJyjKQ3JvdumG5L8k4Ap16UolUxUVTiRHDnRc5Z7z%2bpnfOqqWEE%2fYizF05fLj6p7XAuk9qfV3lta%2fQINIseBI7ZpLYS67cpo4RsZxeZWo4SDXeM%2fX1JJ5xM9y%2bFd4T3i1IqdwJUp0%2bK5PZq1SFMbKiVCZVw3sCMM46X0epqDHtOzDHbr4wKaug1crdVdjJp1XtKz2tO%2f6xKxQ%2faeqGdg%3d%3d&p=1&w=0&s=0&ws=10",
        ],
      },
      {
        hotel: "SKALION HOTEL",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "Турция, Стамбул (Istanbul)",
        meal: "Economic Room Double / Twin- Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: "Москва",
        package: "Перелет включен",
        urls: [
          "https://www.coral.ru/hotels/turkey/skalion-hotel-istanbul/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGzyw%2bEiKQUUfddM8k%2bD1FQ49lcVC9VWmqSdoj6%2bDCWeAgY10OMIqgY7paAHBKWJBbEMKWA0m27WQY%2fZzrja4KuTlyMTk9cw4XJjddHQ6f6Ftn3JAFIKl7hn0kBp543BMVjSP6dqeXIMTgtfzMhNncgmqAiVpCp5jyoGE36s3w%2fH9fshd8TP0lFTtYPIkdANsH9sEvqGCkfft4jagcXIdFQw%3d%3d&p=1&w=0&s=0&ws=10",
        ],
      },
      {
        hotel: "AKKA SUITES",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 3,
        location: "Турция, Стамбул (Istanbul)",
        meal: "Standard No View Room Twin- Завтрак",
        nights: 7,
        passengers: "на двоих",
        departure: "Москва",
        package: "Перелет включен",
        urls: [
          "https://www.coral.ru/hotels/turkey/akka-suites-istanbul/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGaEZ0LqvzOS%2fHykWSp0zqCOcl73twYlRsguTjuJf78BGPpWDLAwSgxsx0w%2bFeeHBPtyMnMDFoBQnMT6nYWwh3DXRm03s4UMw014i%2bIKti5%2fGzTsA1ZXCjRGLO7A%2fm66FQtqzFEEIlCCNmzoYK7vnCbYZtF0sAgxVAUX8Wue52MCj2S4QlAmIe9AKsISpEwxnBQI4HIrVoPVgtHeenSK1AEA%3d%3d&p=1&w=0&s=0&ws=10",
        ],
      },
    ],
  },
  {
    country: "Египет",
    hotels: [{
      hotel: "TITANIC PALACE & AQUA PARK BEACH RESORT",
      dates: ["2025-11-17", "2025-11-30"],
      rating: 4,
      location: "Египет, Хургада (Hurghada)",
      meal: "Coral Standard Room - Ультра все включено",
      nights: 7,
      passengers: "на двоих",
      departure: 'Москва',
      package: "Перелет включен",
      urls: ['https://www.coral.ru/hotels/egypt/titanic-palace-aqua-park-beach-resort-hurghada/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGUIfQo0DNsnstw5%2frlh8y%2bB7xLccAZjbFDyrdN3C8iFBUJFtyCUaLg78fSFY9ylKYM2LXUL%2f7F2oqQamjicrhlZVMan8her14SsbZdzzD3SxeUPbzsf8SbbovyX7L%2b2X%2fUBmoW0OX62zA35Nrby0rESQ1wYOxlwRATpv%2f%2fTUMStChLd%2bu8o28UVkWtNBqrnvHRHf2zTbTk29sQW6xOQRJgQ%3d%3d&p=1&w=0&s=0&ws=10'],
    },
      {
        hotel: "SUNRISE SENTIDO MAMLOUK PALACE RESORT",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Египет, Хургада (Hurghada)",
        meal: "Family Bunk Bed- Все Включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/sunrise-sentido-mamlouk-palace-resort-hurghada/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGXvbU9nCjF3dkToENbdIhSO9hTSznJf3zM8aCuOW%2f%2byROd1BROa%2boAI2HtD3eev%2fsPFGUBqfrFLFFbI6Lzae0E0Sp1Kfo3sZNPapLdQXso3DxqF4bFKFdyvg7l37mATT7t%2bOe6heNGUaqnYMclMervPyCX2sxHgJmONiN8XSwwwcQnuPvlfLyY6NfxhKXeBwDwwKg63HipmjdqHxpNmiV4A%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "PICKALBATROS ALF LEILA WA LEILA RESORT",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "Египет, Хургада (Hurghada)",
        meal: "Standard Room Garden View - Все включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/pickalbatros-alf-leila-wa-leila-resort-neverland-hurghada-hurghada/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGzAWG%2f5e%2fDYmSvDcRKDBjXbA8VVTUKNLN8R1t%2fkzbAXzG%2fKsDHt%2fErGoldjg%2fS3C9YaUFvNUM8VyYw6ACQpqwTvIpt64uOtFU3%2fER64N%2fYwGZJFpZi0bQ9KPWKajmP%2fnq%2fgZrcWked8DPNmPsTzm%2bg4rXyCh%2bC0Qf%2bsQeh0Hf%2f18bAys3GYk55Icq9dhoPkiZTv5gHKqHwWbxJsD60U%2brPw%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "ISLAND VIEW",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Египет, Шарм-эш-Шейх (Sharm El Sheikh)",
        meal: "Standard Room - Все Включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/island-view-sharm-el-sheikh/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGrRmaw4ZOtd5VGP2%2ffuUYJVoHNDZJpEN4VaKbaZ3ylL4YJXvpC0atI406F9Wodjmv4STGb%2folJPKnEoARE0%2b77XRrFus9vIp3IPMOr6ZRGK31a2ydjYlV3%2fKY8ti7FkTB%2f5gu9%2bFcF6yDg4O9l2TGpqmC8et3SDW7GCP4Vdg460fo5bTTI07YrLjlTYWfZXenAmpUYFnV%2bePjY7wShSSVVw%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "SAVOY",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Египет, Шарм-эш-Шейх (Sharm El Sheikh)",
        meal: "Standard Room Garden View - Bed and Breakfast",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/savoy-sharm-el-sheikh/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGRrrvggIzR6gP4N8T3xgv%2fsSKJQT0ODtuSO%2b2AcV51ydVXV89Fn%2br%2bQ52UjwDq9t7Ketszl66KZasNWXu67O4C%2b91o8o4uhNt5OCVVxBUih%2fu%2bYlsk5pV46WbtvYyJ4K5%2biD%2bLDHhhovTx7F6b2%2fITqjZoFn04JVZqZ0bQ7AljuZ3oxtkBI0tPWSJRT0vnbNYe%2bToJKFGrElnUexgbVtThA%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "SIVA SHARM RESORT & SPA",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 5,
        location: "Египет, Шарм-эш-Шейх (Sharm El Sheikh)",
        meal: "Double Standard Room - Все Включено",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/siva-sharm-resort-spa-sharm-el-sheikh/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGk3Br0Dirg%2bTakVxs%2bG35KD07vAHijSDCLxKvm73Rn3FA6yzW4yzl4X6MZI%2f5JbDhomnrpJxGEif0eScwM8VYX%2boWeOKFETAgmw37qK3jg06eViAPaaxWHyOD3i5xy1tOWwqQ7Zt6ePVRXizlfTFSTqaLjPNEZYX6e0O0V6qo0oPsBEozq3JkLfEsa8XQVUN8ivkBAalBUi%2fP2T%2bk88WSzg%3d%3d&p=1&w=0&s=0&ws=10'],
      },
      {
        hotel: "IVY CYRENE SHARM",
        dates: ["2025-11-17", "2025-11-30"],
        rating: 4,
        location: "Египет, Шарм-эш-Шейх (Sharm El Sheikh)",
        meal: "Standard Garden View - Hard all inclusive",
        nights: 7,
        passengers: "на двоих",
        departure: 'Москва',
        package: "Перелет включен",
        urls: ['https://www.coral.ru/hotels/egypt/ivy-cyrene-sharm-sharm-el-sheikh/?qp=lWOJw1XDa14WeujkN6zDTh1%2flzTX%2fGPzT8w6CXGc2nwJKxggVFaB91Lp2wQ055ANEuaJK%2fRs4TGvT2%2bng7I7LEsh7VKuch6pQWysPYofKZDqp%2f%2flS2RdMEimLQWfoEGGJimaFqL2hWroplmjpk6WyHy7tvAfXu2m67u7pU2v8Xu0PP1UFx8OaATrfiKJHk3FaZDYu3zawL4P6VMVjGKtxWuvR5waMYTS1J2ZMea%2fFrBfu8qUZZ7SsCPA8%2bKPaBPzKS2f4a%2fBpE9wxiYsm3esql0rFuQ6q53P8GEVQZoyIqPy0wJEEmrysCBjxVxn4MegUjg8w6ceX%2bX2CFJOVKTGGQ%3d%3d&p=1&w=0&s=0&ws=10'],
      }
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

function formatPrice(num) {
  const formatted = new Intl.NumberFormat('ru-RU').format(num ?? 0);
  return formatted.split(',')[0];
}

/* =================================================================
 *  ВСЁ, ЧТО ВЗАИМОДЕЙСТВУЕТ С DOM
 * ================================================================= */
(async () => {
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
        console.log(firstProduct);
        const amount = firstProduct?.offers?.[0]?.price?.amount || null;
        const imgUrl = firstProduct?.hotel?.images?.[0]?.sizes?.[0]?.url || null;

        // Сервер даёт «самую доступную» — считаем «за ночь/на человека»
        const perNightPerPerson = amount != null ? Math.round(amount / 7) : null;
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


  const altTabsBtnArr = $all(document, '.fake-nav button');
  const altTabsContent = $all(document, '[data-tab-hotles]');

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
    const alternPanel = document.querySelector(`[data-tab-hotles='${initialPanel.getAttribute('data-tab-content')}']`)
    const i = cfgIndexByCountry(initialCountry);
    if (i >= 0 && initialPanel) {
      loadTabDataIntoPanel(alternPanel, window._toursByCountry[i], `hotelData_${initialCountry}`);
      if (typeof ym === 'function') ym(YM_ID, 'reachGoal', 'country-filter', {country: initialCountry});
    }

    // Переключение
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const country = btn.getAttribute('data-tab-button').trim();
        if (typeof ym === 'function') ym(96674199, 'reachGoal', 'bf_25_country', {bf_country: country});
        const panel = activateByCountry(country);
        const alternPanel = document.querySelector(`[data-tab-hotles='${panel.getAttribute('data-tab-content')}']`)
        const idx = cfgIndexByCountry(country)
        if (idx >= 0 && panel) {
          loadTabDataIntoPanel(alternPanel, window._toursByCountry[idx], `hotelData_${country}`);
          if (typeof ym === 'function') ym(YM_ID, 'reachGoal', 'country-filter', {country});
        }

        altTabsBtnArr.forEach(btn => {
          btn.classList.remove('js-active')
        });
        const altTrget = $(document, `[data-fake-nav="${panel.getAttribute('data-tab-content')}"]`)
        altTrget.classList.add('js-active');

        altTabsContent.forEach(tab => tab.classList.remove('js-active'));
        const altTabTrget = $(document, `[data-tab-hotles="${panel.getAttribute('data-tab-content')}"]`)
        altTabTrget.classList.add('js-active');
      });
    });

    altTabsBtnArr.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget;
        $(document, `[data-tab-button='${target.getAttribute('data-fake-nav')}']`).click()
      })
    })
  })();
})();
