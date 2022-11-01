const baseUrl = process.env.VUE_APP_BASE_URL;

export const socials = [
  {
    ref: 'https://vk.com',
    shareref: 'http://vkontakte.ru/share.php?url=https://asian.land',
    icon: baseUrl +'/icons/vk.png',
    alt: 'vk',
  },
  {
    ref: 'https://www.instagram.com',
    shareref: 'https://telegram.me/share/url?url=https://asian.land',
    icon: baseUrl +'/icons/instagram.png',
    alt: 'instagram',
  },
  {
    ref: 'https://tlgg.ru/asian.land',
    shareref: 'https://telegram.me/share/url?url=https://asian.land',
    icon: baseUrl +'/icons/telegram.png',
    alt: 'telegram',
  },
  {
    ref: 'https://wa.me/+79997878358',
    shareref: 'whatsapp://send?text=http://asian.land',
    icon: baseUrl +'/icons/whatsapp.png',
    alt: 'whatsapp',
  },
]