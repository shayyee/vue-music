/**
 * Created by lenovo on 2018/3/19.
 */
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

export function createSong(musicSong) {
  return new Song({
    id: musicSong.songid,
    mid: musicSong.songmid,
    singer: filterSinger(musicSong.singer),
    name: musicSong.songname,
    album: musicSong.albumname,
    duration: musicSong.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicSong.albummid}.jpg?max_age=2592000`,
    url: `http://dl.stream.qqmusic.qq.com/C400${musicSong.songmid}.m4a`
  })
}

function filterSinger(singerArr) {
  let ret = [];
  if(!singerArr) {
    return ''
  }
  singerArr.forEach(i => {
    ret.push(i.name);
  });
  return ret.join('/')
}