const host = '192.168.0.101';
const port = '3333';
const url = `http://${process.env.HOST}:${process.env.PORT}/static/platforms/icons`;
const urlThumbnail = `http://${process.env.HOST}:${process.env.PORT}/static/platforms/thumbnails`;

const platforms = [
    { name: "9GAG", icon: `${url}/9gag.png`, thumbnail: `${urlThumbnail}/9gag.png` },   
    { name: "Apple", icon: `${url}/apple.png`, thumbnail: `${urlThumbnail}/apple.png` },
    { name: "BBC", icon: `${url}/bbc.png`, thumbnail: `${urlThumbnail}/bbc.png` },
    { name: "Behance", icon: `${url}/behance.png`, thumbnail: `${urlThumbnail}/behance.png` },
    { name: "Bloombreg", icon: `${url}/bloomberg.png`, thumbnail: `${urlThumbnail}/bloomberg.png` },
    { name: "CNN", icon: `${url}/cnn.png`, thumbnail: `${urlThumbnail}/cnn.png` },
    { name: "Deezer", icon: `${url}/deezer.png`, thumbnail: `${urlThumbnail}/deezer.png` },
    { name: "Discord", icon: `${url}/discord.png`, thumbnail: `${urlThumbnail}/discord.png` },
    { name: "Disney+", icon: `${url}/disney+.png`, thumbnail: `${urlThumbnail}/disney+.png` },
    { name: "Dribbble", icon: `${url}/dribbble.png`, thumbnail: `${urlThumbnail}/dribbble.png`  },
    { name: "Epic Games", icon: `${url}/epic-games.png`, thumbnail: `${urlThumbnail}/epic-games.png` },
    { name: "Facebook", icon: `${url}/facebook.png`, thumbnail: `${urlThumbnail}/facebook.png` },
    { name: "Figma", icon: `${url}/figma.png`, thumbnail: `${urlThumbnail}/figma.png` },
    { name: "GitHub", icon: `${url}/github.png`, thumbnail: `${urlThumbnail}/github.png` },
    { name: "GitLab", icon: `${url}/gitlab.png`, thumbnail: `${urlThumbnail}/gitlab.png` },
    { name: "Gmail", icon: `${url}/gmail.png`, thumbnail: `${urlThumbnail}/gmail.png` },
    { name: "GOG", icon: `${url}/gog.png`, thumbnail: `${urlThumbnail}/gog.png` },
    { name: "HBO Max", icon: `${url}/hbo-max.png`, thumbnail: `${urlThumbnail}/hbo-max.png` },
    { name: "Instagram", icon: `${url}/instagram.png`, thumbnail: `${urlThumbnail}/instagram.png` },
    { name: "iQIYI", icon: `${url}/iqiyi.png`, thumbnail: `${urlThumbnail}/iqiyi.png` },
    { name: "JOOX", icon: `${url}/joox.png`, thumbnail: `${urlThumbnail}/joox.png` },
    { name: "Line", icon: `${url}/line.png`, thumbnail: `${urlThumbnail}/line.png` },
    { name: "Mediafire", icon: `${url}/mediafire.png`, thumbnail: `${urlThumbnail}/mediafire.png` },
    { name: "Mega", icon: `${url}/mega.png`, thumbnail: `${urlThumbnail}/mega.png` },
    { name: "MyAnimeList", icon: `${url}/myanimelist.png`, thumbnail: `${urlThumbnail}/myanimelist.png` },
    { name: "Netflix", icon: `${url}/netflix.png`, thumbnail: `${urlThumbnail}/netflix.png` },
    { name: "Outlook", icon: `${url}/outlook.png`, thumbnail: `${urlThumbnail}/outlook.png` },
    { name: "Pinterest", icon: `${url}/pinterest.png`, thumbnail: `${urlThumbnail}/pinterest.png` },
    { name: "Reddit", icon: `${url}/reddit.png`, thumbnail: `${urlThumbnail}/reddit.png` },
    { name: "Replit", icon: `${url}/replit.png`, thumbnail: `${urlThumbnail}/replit.png` },
    { name: "Riot Games", icon: `${url}/riot-games.png`, thumbnail: `${urlThumbnail}/riot-games.png` },
    { name: "Roblox", icon: `${url}/roblox.png`, thumbnail: `${urlThumbnail}/roblox.png` },
    { name: "Rockstar Games", icon: `${url}/rockstar-games.png`, thumbnail: `${urlThumbnail}/rockstar-games.png` },
    { name: "Snapchat", icon: `${url}/snapchat.png`, thumbnail: `${urlThumbnail}/snapchat.png` },
    { name: "SoundCloud", icon: `${url}/soundcloud.png`, thumbnail: `${urlThumbnail}/soundcloud.png` },
    { name: "Spotify", icon: `${url}/spotify.png`, thumbnail: `${urlThumbnail}/spotify.png` },
    { name: "Steam", icon: `${url}/steam.png`, thumbnail: `${urlThumbnail}/steam.png` },
    { name: "TikTok", icon: `${url}/tiktok.png`, thumbnail: `${urlThumbnail}/tiktok.png` },
    { name: "Trello", icon: `${url}/trello.png`, thumbnail: `${urlThumbnail}/trello.png` },
    { name: "Tumblr", icon: `${url}/tumblr.png`, thumbnail: `${urlThumbnail}/tumblr.png` },
    { name: "Twitch", icon: `${url}/twitch.png`, thumbnail: `${urlThumbnail}/twitch.png` },
    { name: "Twitter", icon: `${url}/twitter.png`, thumbnail: `${urlThumbnail}/twitter.png` },
    { name: "Wattpad", icon: `${url}/wattpad.png`, thumbnail: `${urlThumbnail}/wattpad.png` },
    { name: "Webtoon", icon: `${url}/webtoon.png`, thumbnail: `${urlThumbnail}/webtoon.png` },
    { name: "Wi-Fi", icon: `${url}/wifi.png`, thumbnail: `${urlThumbnail}/wifi.png` },
];

module.exports = platforms;