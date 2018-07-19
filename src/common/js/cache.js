/**
 * Created by lenovo on 2018/7/19.
 * localStorage的存取相关
 */
import storage from 'good-storage'

const SERACH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15  // 存储最大数目

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

export function saveSearch(query) {
  let searches = storage.get(SERACH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SERACH_KEY, searches)
  return searches
}