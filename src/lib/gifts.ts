export interface Gift {
    id: string;
    title: string;
    tagline: string;
    image: string;
    badgeText: string;
    type: 'giveaway' | 'product' | 'gift_card';
}

export const GIFTS: Gift[] = [
    {
        id: 'dyson-giveaway',
        title: 'Buy Today & Be Lucky!',
        tagline: 'Buy today to be eligible for our Dyson giveaway',
        image: '/dyson-giveaway.jpg',
        badgeText: 'Lucky Draw',
        type: 'giveaway',
    },
];
