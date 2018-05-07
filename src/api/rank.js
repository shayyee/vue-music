import axios from 'axios'
import {commonParams} from './config'

export function getTopList(songmid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';
  const data = Object.assign({}, commonParams, {
    g_tk:5381,
    format:'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}