/**
 * Created by lenovo on 2018/7/19.
 * localStorage的存取相关
 */
import storage from 'good-storage'

const SERACH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15  // 存储最大数目

const PLAY_KEY = '__play__'
const PLAY_MAX_LENGTH = 200  // 存储最大数目

function insertArray(arr,val,compare, maxLen) {
  const index = arr.findIndex(compare)
  if(index === 0) {  // 第一条数据
    return
  }
  // 有 删除再插入
  if(index > 0) {
    arr.splice(index, 1)
  }
  // 没有 直接插入到第一个
  arr.unshift(val)
  if(maxLen && arr.length >maxLen) {
    arr.pop()
  }
}
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if(index > -1) {
    arr.splice(index, 1)
  }
}
export function saveSearch(query) {
  let searches = storage.get(SERACH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SERACH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SERACH_KEY,[])
}

export function deleteSearch(query) {
  let searches = storage.get(SERACH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SERACH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SERACH_KEY)
  return []
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return item.id === song.id
  })
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}